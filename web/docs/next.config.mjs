import nextra from "nextra";
// Set up Nextra with its configuration
const withNextra = nextra({
  // Enable search functionality
  search: true,
});

const NextConfig = {
  output: 'standalone'
};

// Export the final Next.js config with Nextra included
export default withNextra({
  // ... Add regular Next.js options here
  ...NextConfig,
});
