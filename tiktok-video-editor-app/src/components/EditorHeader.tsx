import React from "react";
import { AppNavbar } from "./AppNavbar";

interface EditorHeaderProps {
  title: string;
  onGoBack: () => void;
}

export function EditorHeader({
  title,
  onGoBack,
}: EditorHeaderProps): React.JSX.Element {
  return <AppNavbar showBackButton projectTitle={title} onBack={onGoBack} />;
}
