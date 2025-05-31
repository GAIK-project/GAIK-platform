// web/dashboard/app/test/page.tsx
import { ApiResponse, User } from "@gaik/shared-types";
import { Button, Card, Input } from "@gaik/shared-components";

function Page() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
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

  return (
    <div className="space-y-6">
      <Card>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Shared Components Test</h1>
        <p className="text-gray-600 mb-4">Shared types working! User email: {response.data?.email}</p>
        
        <div className="space-y-4">
          <Input 
            label="Test Input" 
            placeholder="Try typing here..." 
            helperText="This input component comes from @gaik/shared-components"
          />
          
          <div className="flex gap-2">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="danger">Danger Button</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
