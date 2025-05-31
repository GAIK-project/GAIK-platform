# @gaik/shared-components

Reusable React components for GAIK applications.

## Usage

```tsx
import { Button, Card, Layout, Input, ChartContainer } from '@gaik/shared-components';

function MyPage() {
  return (
    <Layout header={<h1>GAIK Dashboard</h1>}>
      <Card>
        <h2>Welcome to GAIK</h2>
        <Input label="Name" placeholder="Enter your name" />
        <Button onClick={() => alert('Hello!')}>Click me</Button>
        
        <ChartContainer title="Analytics" loading={false}>
          <p>Chart content would go here</p>
        </ChartContainer>
      </Card>
    </Layout>
  );
}
```

## Structure

```text
shared/components/
├── ui/        # Basic UI components
├── layout/    # Layout components  
├── forms/     # Form components
└── charts/    # Data visualization
```

## Development

1. Create component in appropriate folder
2. Export from `index.ts`
3. Use types from `@gaik/shared-types`

Example:
```tsx
import { ButtonProps } from '@gaik/shared-types';

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => (
  <button {...props}>{children}</button>
);
```

## Note

These are example components to demonstrate the pattern. Feel free to modify or replace them with your own components as needed.
