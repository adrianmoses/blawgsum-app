import {EditorContent, useEditor} from "@tiptap/react";
import {StarterKit} from "@tiptap/starter-kit";
import {Document} from "@tiptap/extension-document";
import {Placeholder} from "@tiptap/extension-placeholder";
import {Heading} from "@tiptap/extension-heading";
import {Paragraph} from "@tiptap/extension-paragraph";
import debounce from "@/src/app/utils/debounce"
import findTitleHeading from "@/src/app/utils/find-title-heading";


const CustomDocument = Document.extend({
  content: 'heading block*'
})

interface TipTapProps {
  html: string;
  setHtml: (html: string) => void;
  title: string;
  setTitle: (title: string) => void;
  saveArticle: (data: string) => void;
}

const Tiptap = ({ html, setHtml, setTitle, title, saveArticle }: TipTapProps) => {
  const editor = useEditor({
    extensions: [
      CustomDocument,
      StarterKit.configure({
        document: false
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return 'Untitled'
          }

          return 'Write something cool'
        }
      }),
      Paragraph.configure({
        HTMLAttributes: {
          class: 'is-empty'
        }
      }),
      Heading.configure({
        HTMLAttributes: {
          class: 'text-2xl font-bold'
        }
      })
    ],
    autofocus: true,
    content: html,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
      },
    }
  })

  const debounceSaveArticle = debounce(saveArticle, 300);
  editor?.on('update', ({ editor }) => {
    const title = findTitleHeading(editor.getJSON())
    const htmlData = editor.getHTML();
    setTitle(title)
    setHtml(htmlData)
    debounceSaveArticle();
  })

  return (
    <>
      <EditorContent editor={editor} />
    </>
  )
}

export default Tiptap
