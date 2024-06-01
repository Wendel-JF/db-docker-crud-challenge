export const Home = ({ children }: { children: JSX.Element[] }) => {
  return (
    <div class={"flex flex-col justify-center items-center gap-4 w-1/3 h-full"}>
      <div
        id={"posts"}
        class={
          "w-full h-4/6 flex flex-col gap-2 p-2 overflow-auto"
        }
      >
        {children}
      </div>
      <form
        hx-post="/posts"
        hx-trigger="submit"
        hx-target="#posts"
        hx-swap="beforeend"
        class={"flex flex-col justify-self-end items-center gap-2 w-1/2"}
      >
        <div class={"w-full flex flex-col"}>
          <label for="title" class={"text-white"}>
            Título:
          </label>
          <input
            type="text"
            name="title"
            id="title"
            max={255}
            placeholder="Título do post"
            class={"rounded p-1"}
          />
        </div>
        <div class={"w-full flex flex-col rounded"}>
          <label for="content" class={"text-white"}>
            Conteúdo:
          </label>
          <textarea name="content" id="content" class={"rounded p-1"} />
        </div>
        <button
          type="submit"
          class={
            "flex p-2 w-fit bg-green-500 text-center rounded hover:opacity-[0.8]"
          }
        >
          Enviar
        </button>
      </form>
    </div>
  );
};
