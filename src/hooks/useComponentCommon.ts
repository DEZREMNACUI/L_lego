import { pick } from "lodash-es";
import { computed } from "vue"
import { TextComponentProps } from "../defaultProps";

export const useComponentCommon = (props: Readonly<Partial<TextComponentProps>>, styleNames: string[]) => {
  const styleProps = computed(() => pick(props, styleNames));
  const handleClick = () => {
    if (props.actionType === "url" && props.url) {
      window.location.href = props.url;
    }
  }
  return {
    styleProps,
    handleClick
  }
}