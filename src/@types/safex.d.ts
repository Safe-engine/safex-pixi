import { NodeComp } from "..";

interface BaseComponentProps {
  $ref?: object;
  $refNode?: NodeComp<any>
  $push?: object[];
  node?: Partial<NodeComp>;
}

interface NodeCompProps {
  nodeName?: string
}

interface LoadingBarProps {
}
