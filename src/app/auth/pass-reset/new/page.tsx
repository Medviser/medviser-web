import PasswordResetNewContent from "./content";

type Props = {
  searchParams: Promise<{
    token?: string;
    error?: string;
  }>;
};

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <PasswordResetNewContent
      token={params.token}
      error={params.error}
    />
  );
}