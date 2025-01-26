import { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const modalTitleVariants = cva("text-xl font-bold mb-4", {
  variants: {
    variant: {
      default: "text-gray-900",
      underline: "text-gray-900 underline",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type ModalTitleProps = {
  children: ReactNode;
} & VariantProps<typeof modalTitleVariants>;

export const ModalTitle = ({ children, variant }: ModalTitleProps) => {
  return <h2 className={modalTitleVariants({ variant })}>{children}</h2>;
};
