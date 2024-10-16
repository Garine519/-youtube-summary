import type { Meta, StoryObj } from "@storybook/react";
import OptionsComponent from "../components/Options";

const meta = {
  title: "Components/Options",
  component: OptionsComponent,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof OptionsComponent>;

export default meta;

type Story = StoryObj<typeof meta>;
export const OptionsStory: Story = {};
