import { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const modalDescriptionVariants = cva("text-sm text-gray-600 mb-4", {
  variants: {
    variant: {
      default: "",
      italic: "italic",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type ModalDescriptionProps = {
  children: ReactNode;
} & VariantProps<typeof modalDescriptionVariants>;

export const ModalDescription = ({ children, variant }: ModalDescriptionProps) => {
  return <p className={modalDescriptionVariants({ variant })}>{children}</p>;
};
