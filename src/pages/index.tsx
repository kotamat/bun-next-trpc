import { FC } from "react";
import { trpc } from "src/utils/trpc";

const IndexPage: FC = () => {
  const hello = trpc.useQuery(["hello", { text: "world" }]);
  if (!hello.data) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <h1>{hello.data.greeting}</h1>
    </div>
  );
};

export default IndexPage;
