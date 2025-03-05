import { NodeComp } from "..";

interface BaseComponentProps {
  $ref?: object;
  $push?: object[];
  node?: Partial<NodeComp>;
}

interface NodeCompProps {
  nodeName?: string
}

interface LoadingBarProps {
}
