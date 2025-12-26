import { FullPageError } from "@/components/FullPageError";
import AggrementGenerator from "@/components/Page/AggrementGenerator";
import { decodeToken, tokenIsVerified } from "@/utils/Token";
import { JwtPayload } from "jsonwebtoken";

type PageProps = {
  searchParams: {
    token?: string;
  };
};


export default function Page({ searchParams }: PageProps) {
  const token = searchParams?.token;

  if (!token) {
    return (
      <FullPageError message="Token missing from URL" title="Authorization Error" />
    );
  }

  const isValid = tokenIsVerified(token);

  if (!isValid) {
    return (
      <FullPageError message="Token expired or Invalid" title="Authorization Error" />
    );
  }

  const decoded: JwtPayload = decodeToken(token);
  const name = (decoded?.first_name as string)+" "+decoded?.last_name as string;
  const email = decoded?.email as string;
  const is_admin = decoded?.is_admin as boolean;

  if (!is_admin) {
    return (
      <FullPageError message="Only Admins can use this feature!" title="Authorization Error"/>
    );
  }

  return (
    <AggrementGenerator
      name={name}
      email={email}
      token={token}
    />
  );
}
