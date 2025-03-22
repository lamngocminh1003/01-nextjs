import Verify from "@/components/auth/verify";

const VerifyPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <>
      <Verify _id={id} />
    </>
  );
};

export default VerifyPage;
