import { Html, html } from "@elysiajs/html";
import * as dotenv from "dotenv";
import { Elysia, t } from "elysia";
import { Base } from "./components/base";
import { Comment } from "./components/comment";
import { Details } from "./components/details";
import { Home } from "./components/home";
import { Post } from "./components/post";
import { PostForm } from "./components/post-form";
import { db } from "./db";
import { CommentSchema } from "./types/comment";
import { PostSchema } from "./types/post";
import { formatDate } from "./utils/formatDate";

dotenv.config();

const app = new Elysia()
  .use(html())
  .decorate("db", db)
  .decorate("formatDate", formatDate)
  .get("/", async ({ db, formatDate }) => {
    // TODO - Essa query deve retornar todas as colunas de todos os registros da tabela posts
    const query: string = `SELECT * FROM posts ORDER BY id DESC`;

    const { rows } = await db.query<PostSchema>(query);
   
    return (
      <Base>
        <Home>
          {rows.map((post) => (     
            <Post
              id={post.id}
              content={post.content}
              title={post.title}
              createdAt={formatDate(post.created_at)}
              
            ></Post>
          ))}
          
        </Home>
      </Base>
    );
  })
  .get("/edit/:id", async ({ db, params, error }) => {
    // TODO - Essa query deve retornar todas as colunas do registro da tabela posts onde o id é igual ao id passado como parâmetro
    const query: string = `SELECT * FROM posts WHERE id = $1`;

    try {
      const { rows } = await db.query<PostSchema>(query, [params.id]);
      const post = rows[0];

      return <PostForm {...post} />;
    } catch (e) {
      console.error(e);
      return error(500, "Internal Server Error");
    }
  })
  .post(
    "/posts",
    async ({ db, body, error, formatDate }) => {
      // Query para inserir um novo registro na tabela posts
      const insertQuery: string = `
        INSERT INTO posts (title, content, created_at)
        VALUES ($1, $2, NOW());
      `;
      // Query para retornar todas as colunas do último registro da tabela posts
      const query: string = `
        SELECT * FROM posts
        ORDER BY id DESC
        LIMIT 1;
      `;
      
      try {
        // Executando a inserção de um novo post
        await db.query(insertQuery, [body.title, body.content]);
        // Obtendo o último post inserido
        const { rows } = await db.query<PostSchema>(query);
  
        if (rows.length === 0) {
          return error(404, "Post not found");
        }
  
        const { id, created_at, content, title } = rows[0];
  
  
        // Retornando o componente Post com os dados formatados
        return (
          <Post
            id={id}
            content={content}
            createdAt={formatDate(created_at)}
            title={title}
          />
        );
      } catch (e) {
        console.error(e);
        return error(500, "Internal Server Error");
      }
    },
    {
      body: t.Object({
        title: t.String(),
        content: t.String(),
      }),
    }
  )  
  .patch(
    "/posts/:id",
    async ({ db, body, params, error }) => {
      // TODO - Essa query deve atualizar o registro da tabela posts onde o id é igual ao id passado como parâmetro,
      //  atribuindo os valores passados no corpo da requisição para as colunas title e content
      const updateQuery: string = `UPDATE posts 
      SET 
      title = $1,
      content = $2
      WHERE 
      id = $3
      `;

      // TODO - Essa query deve retornar todas as colunas do registro da tabela posts onde o id é igual ao id passado como parâmetro
      const selectQuery: string = "SELECT * FROM posts WHERE id = $1";

      try {
        await db.query(updateQuery, [body.title, body.content, params.id]);

        const { rows } = await db.query<PostSchema>(selectQuery, [params.id]);

        const post = rows[0];

        return (
          <Post
            id={post.id}
            content={post.content}
            title={post.title}
            createdAt={formatDate(post.created_at)}
          />
        );
      } catch (e) {
        console.error(e);
        return error(500, "Internal Server Error");
      }
    },
    {
      body: t.Object({
        title: t.String(),
        content: t.String(),
      }),
    }
  )
  .delete("/posts/:id", async ({ db, params, error }) => {
        // TODO - Essa query deve deletar todos os registros de comentarios vinculados/associados a este post para não um erro
    const CommentsQuery: string = `
    DELETE FROM comments 
    WHERE post_id = $1;
    `;

        // TODO - Essa query deve deletar o registro da tabela posts onde o id é igual ao id passado como parâmetro
    const PostsQuery: string = `
    DELETE FROM posts WHERE id = $1;
    `;
    
    try {
      await db.query(CommentsQuery, [params.id]);
      await db.query(PostsQuery, [params.id]);
    } catch (e) {
      console.error(e);
      return error(500, "Internal Server Error");
    }
  })
  .get("/posts/:id", async ({ db, params, error }) => {
    
    // TODO - Essa query deve retornar todas as colunas do registro da tabela posts onde o id é igual ao id passado como parâmetro
    const postsQuery = `SELECT * FROM posts WHERE id = $1`;

    // TODO - Essa query deve retornar as colunas:
    // content, created_at, e id
    // dos registros da tabela comments onde o id do post relacionado é igual ao id passado como parâmetro
    const commentsQuery = `SELECT c.id, c.content, c.created_at FROM comments c
    INNER JOIN posts p 
    ON c.post_id = p.id
    WHERE c.post_id = $1
    ORDER BY c.id DESC
    `;
    
    try {
      const { rows: postRows } = await db.query<PostSchema>(
        postsQuery,
        [params.id]
      );

      const post = postRows[0];
     
      const { rows: commentRows } = await db.query<CommentSchema>(
        commentsQuery,
        [params.id]
      );
      post.comments = commentRows;

      return (
        <Details postId={post.id}>
          <Post
            id={post.id}
            title={post.title}
            content={post.content}
            createdAt={formatDate(post.created_at)}
            showSidebar={false}
          ></Post>
          <div id={"comments"} class={"w-full h-2/4 flex flex-col gap-4"}>
            {post.comments.map((comment) => (
              <Comment {...comment}></Comment>
            ))}
          </div>
        </Details>
      );
    } catch (e) {
      console.error(e);
      return error(500, "Internal Server Error");
    }
  })
  .post(
    "/comments/:postId",
    async ({ db, body, params, error }) => {
      // TODO - Essa query deve inserir um novo registro na tabela comments,
      //  atribuindo os valores passados no corpo da requisição para as colunas content e post_id
      const insertQuery = ` 
      INSERT INTO comments (content, post_id)
      VALUES ($1, $2);`;

      // TODO - Essa query deve retornar todas as colunas do último registro da tabela comments onde o id
      // do post relacionado é igual ao id passado como parâmetro
      const selectQuery = `SELECT c.* FROM comments c
      INNER JOIN posts p 
      ON c.post_id = p.id
      WHERE c.post_id = $1
      ORDER BY c.id DESC
      LIMIT 1
      `;
      try {
        await db.query(insertQuery, [body.content, params.postId]);
       
        const { rows } = await db.query<CommentSchema>(selectQuery, [
          params.postId,
        ]);

        const comment = rows[0];

        return <Comment {...comment} />;
      } catch (e) {
        console.error(e);
        return error(500, "Internal Server Error");
      }
    },
    {
      body: t.Object({
        content: t.String(),
      }),
    }
  )
  .delete("/comments/:id", async ({ db, params, error }) => {
    // TODO - Essa query deve deletar o registro da tabela comments onde o id é igual ao id passado como parâmetro
    const query = `DELETE FROM comments WHERE id = $1`;
    try {
      await db.query(query, [params.id]);
    } catch (e) {
      console.error(e);
      return error(500, "Internal Server Error");
    }
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
