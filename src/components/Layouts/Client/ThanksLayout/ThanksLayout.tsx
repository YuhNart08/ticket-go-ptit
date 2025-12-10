import type { PropsWithChildren } from "react";
import Header from "../components/Header/Header";

const ThanksLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div>
        <Header />
        <div className="flex flex-1 flex-col">{children}</div>
      </div>
    </>
  );
};

export default ThanksLayout;
