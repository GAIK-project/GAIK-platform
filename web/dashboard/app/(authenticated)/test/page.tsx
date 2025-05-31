// web/dashboard/app/test/page.tsx
import { ApiResponse, User } from "@gaik/shared-types";

function Page() {
  return (
    <div>
      <TestPage />
    </div>
  );
}
export default Page;
const TestPage = () => {
  const response: ApiResponse<User> = {
    success: true,
    data: {
      id: "1",
      email: "test@example.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };

  return <div>Shared types working! {response.data?.email}</div>;
};
