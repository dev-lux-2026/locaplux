// app/[locale]/partner/products/[id]/page.tsx

import EditProduct from "./EditProduct";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params; // Next.js 15 : params est une Promise

  return <EditProduct id={id} />;
}
