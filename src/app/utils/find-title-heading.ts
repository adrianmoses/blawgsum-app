import _ from "lodash"
import {JSONContent} from "@tiptap/core";


export default function findTitleHeading(doc: JSONContent) {
  const heading = _.find(doc.content, { 'type': 'heading' });
  const headingContent = _.first(heading?.content)
  const text = headingContent?.text
  return text ? text : ""
}
