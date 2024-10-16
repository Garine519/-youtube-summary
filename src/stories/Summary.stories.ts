import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import Summary from "../components/Summary";

const meta = {
  title: "Components/Summary",
  component: Summary,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: { onSummaryFetch: fn(), openOptions: fn() },
} satisfies Meta<typeof Summary>;

export default meta;

type Story = StoryObj<typeof meta>;
export const Idle: Story = {};
export const Unavailable: Story = {
  args: {
    unavailable: true,
  },
};

export const Success: Story = {
  args: {
    data: 'This is a summary',
  },
};

export const Error: Story = {
  args: {
    error: 'An error occurred. Status code: 500',
  },
};
