import {
  FormProvider,
  type UseFormReturn,
  type FieldValues,
} from "react-hook-form";

type FormProviderWrapperProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  children: React.ReactNode;
  className?: string;
};

export function FormProviderWrapper<T extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
}: FormProviderWrapperProps<T>) {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        {children}
      </form>
    </FormProvider>
  );
}