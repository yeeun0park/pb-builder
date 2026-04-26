import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

type State = {
  error: Error | null;
  errorInfo: ErrorInfo | null;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, errorInfo: null };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[PB Builder] Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  reset = () => {
    this.setState({ error: null, errorInfo: null });
  };

  reload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.error) return this.props.children;

    const message = this.state.error.message || "알 수 없는 오류";
    const stack = this.state.error.stack || "";

    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px",
          background: "#fafafa",
          fontFamily:
            "'PBGothic', -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: 560,
            background: "#fff",
            border: "1px solid #e5e5e5",
            borderRadius: 12,
            padding: "32px 28px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              margin: "0 0 12px",
              color: "#1a1a1a",
              letterSpacing: "-0.02em",
            }}
          >
            앱 실행 중 문제가 발생했어요
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "#666",
              margin: "0 0 20px",
              lineHeight: 1.6,
            }}
          >
            아래 메시지를 복사해서 담당자에게 공유해주세요. "다시 시도"
            로 복구되거나, 안 되면 "새로고침" 으로 페이지를 다시 띄워보세요.
          </p>
          <pre
            style={{
              fontSize: 12,
              background: "#f5f5f5",
              border: "1px solid #e5e5e5",
              borderRadius: 8,
              padding: "12px 14px",
              margin: "0 0 20px",
              maxHeight: 200,
              overflow: "auto",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              color: "#444",
              fontFamily: "monospace",
            }}
          >
            {message}
            {stack ? "\n\n" + stack.split("\n").slice(0, 6).join("\n") : ""}
          </pre>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={this.reset}
              style={{
                flex: 1,
                padding: "12px 16px",
                background: "#2B75B9",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              다시 시도
            </button>
            <button
              type="button"
              onClick={this.reload}
              style={{
                padding: "12px 16px",
                background: "#fff",
                color: "#1a1a1a",
                border: "1px solid #d8d8d8",
                borderRadius: 8,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              새로고침
            </button>
          </div>
        </div>
      </div>
    );
  }
}
