import {
  FormProvider,
  type UseFormReturn,
  type FieldValues,
} from "react-hook-form";
import { Form } from "react-router";

type FormProviderWrapperProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  children: React.ReactNode;
  className?: string;
};

export function FormProviderWrapper<T extends FieldValues>({
  form,
  children,
  className,
}: FormProviderWrapperProps<T>) {
  return (
    <FormProvider {...form}>
      <Form method="post" className={className}>
        {children}
      </Form>
    </FormProvider>
  );
}