export function Window(props: { active: boolean; title: string; url: string }) {
  return (
    <section
      classList={{
        Window: true,
        '-active': props.active,
      }}
    >
      <div class="WindowTitleBar">
        <div class="WindowTitleIcon"></div>
        <div class="WindowTitleText">{props.title}</div>
        <div class="WindowTitleButtons">
          <button class="Button WindowTitleButton"></button>
          <button class="Button WindowTitleButton"></button>
          <button class="Button WindowTitleButton"></button>
        </div>
      </div>
      <div class="WindowContent SmallSpacing">{props.url}</div>
      <div class="WindowResize"></div>
    </section>
  );
}
