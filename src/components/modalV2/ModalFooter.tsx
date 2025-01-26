import { ReactNode } from "react";

type ModalFooterProps = {
  children: ReactNode;
};

export const ModalFooter = ({ children }: ModalFooterProps) => {
  return <div className="flex justify-end space-x-2 mt-4">{children}</div>;
};
