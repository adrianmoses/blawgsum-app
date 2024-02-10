import {EditorContent, useEditor} from "@tiptap/react";
import {StarterKit} from "@tiptap/starter-kit";
import {Placeholder} from "@tiptap/extension-placeholder";
import {Paragraph} from "@tiptap/extension-paragraph";
import {useEffect} from "react";
import {Typography} from "@tiptap/extension-typography";
import {Highlight} from "@tiptap/extension-highlight";


interface TipTapProps {
  html: string;
  onChange: (...event: any[]) => void;
}

const Tiptap = ({ html, onChange }: TipTapProps) => {

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: false
      }),
      Placeholder.configure({
        placeholder: () => {
          return 'Write something cool'
        }
      }),
      Paragraph.configure({
        HTMLAttributes: {
          class: 'is-empty'
        }
      }),
      Typography,
      Highlight
    ],
    autofocus: true,
    content: html,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    }
  })

  useEffect(() => {
    if (html && html !== editor?.getHTML()) {
      editor?.commands.setContent(html)
    }
  }, [html]);


  return (
    <div className="border border-gray-400 rounded-md min-h-96">
      <EditorContent editor={editor} />
    </div>
  )
}

export default Tiptap
