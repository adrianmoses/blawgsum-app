import {Editor, EditorContent, useEditor} from "@tiptap/react";
import {StarterKit} from "@tiptap/starter-kit";
import {Placeholder} from "@tiptap/extension-placeholder";
import {Paragraph} from "@tiptap/extension-paragraph";
import {useEffect} from "react";
import {Typography} from "@tiptap/extension-typography";
import {Highlight} from "@tiptap/extension-highlight";
import {Underline} from "@tiptap/extension-underline";
import {common, createLowlight} from 'lowlight'
import {TextAlign} from "@tiptap/extension-text-align";
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';

import {
  Bold,
  Italic,
  Strikethrough,
  Underline as UnderlineIcon,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Pilcrow,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Code2,
  TextQuote,
  Table as TableIcon,
  Undo2,
  Redo2,
} from 'lucide-react'


interface TipTapProps {
  html: string;
  onChange: (...event: any[]) => void;
}

const MenuIcon = ({ editor } : { editor: Editor }) => [
  {
    id: 1,
    name: 'bold',
    icon: Bold,
    onClick: () => editor.chain().focus().toggleBold().run(),
    disable: !editor?.can().chain().focus().toggleBold().run(),
    isActive: editor.isActive('bold') ? 'is-active text-green-700' : '',
  },
  {
    id: 2,
    name: 'italic',
    icon: Italic,
    onClick: () => editor.chain().focus().toggleItalic().run(),
    disable: !editor.can().chain().focus().toggleItalic().run(),
    isActive: editor.isActive('italic') ? 'is-active text-green-700' : '',
  },
  {
    id: 3,
    name: 'underline',
    icon: UnderlineIcon,
    onClick: () => editor.chain().focus().toggleUnderline().run(),
    disable: false,
    isActive: editor.isActive('underline') ? 'is-active text-green-700' : '',
  },
  {
    id: 4,
    name: 'strikethrough',
    icon: Strikethrough,
    onClick: () => editor.chain().focus().toggleStrike().run(),
    disable: !editor.can().chain().focus().toggleStrike().run(),
    isActive: editor.isActive('strike') ? 'is-active text-green-700' : '',
  },
  {
    id: 5,
    name: 'code',
    icon: Code,
    onClick: () => editor.chain().focus().toggleCode().run(),
    disable: !editor.can().chain().focus().toggleCode().run(),
    isActive: editor.isActive('code') ? 'is-active text-green-700' : '',
  },
  {
    id: 6,
    name: 'heading1',
    icon: Heading1,
    onClick: () => editor.chain().focus().toggleHeading({ level: 1}).run(),
    disable: false,
    isActive: editor.isActive('heading', { level: 1 })
      ? 'is-active text-green-700'
      : '',
  },
  {
    id: 7,
    name: 'heading2',
    icon: Heading2,
    onClick: () => editor.chain().focus().toggleHeading({ level: 2}).run(),
    disable: false,
    isActive: editor.isActive('heading', { level: 2 })
      ? 'is-active text-green-700'
      : '',
  },
  {
    id: 8,
    name: 'heading3',
    icon: Heading3,
    onClick: () => editor.chain().focus().toggleHeading({ level: 3}).run(),
    disable: false,
    isActive: editor.isActive('heading', { level: 3 })
      ? 'is-active text-green-700'
      : '',
  },
  {
    id: 9,
    name: 'heading4',
    icon: Heading4,
    onClick: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
    disable: false,
    isActive: editor.isActive('heading', { level: 4 })
      ? 'is-active text-green-700'
      : '',
  },
  {
    id: 10,
    name: 'heading5',
    icon: Heading5,
    onClick: () => editor.chain().focus().toggleHeading({ level: 5 }).run(),
    disable: false,
    isActive: editor.isActive('heading', { level: 5 })
      ? 'is-active text-green-700'
      : '',
  },
  {
    id: 11,
    name: 'paragraph',
    icon: Pilcrow,
    onClick: () => editor.chain().focus().setParagraph().run(),
    disable: false,
    isActive: editor.isActive('paragraph')
      ? 'is-active text-green-700'
      : '',
  },
  {
    id: 12,
    name: 'bullet list',
    icon: List,
    onClick: () => editor.chain().focus().toggleBulletList().run(),
    disable: false,
    isActive: editor.isActive('bulletList')
      ? 'is-active text-green-700'
      : '',
  },
  {
    id: 13,
    name: 'ordered list',
    icon: ListOrdered,
    onClick: () => editor.chain().focus().toggleOrderedList().run(),
    disable: false,
    isActive: editor.isActive('orderedList')
      ? 'is-active text-green-700'
      : '',
  },
  {
    id: 14,
    name: 'align left',
    icon: AlignLeft,
    onClick: () => editor.chain().focus().setTextAlign('left').run(),
    disable: false,
    isActive: editor.isActive({ textAlign: 'left' })
      ? 'is-active'
      : '',
  },
  {
    id: 15,
    name: 'align center',
    icon: AlignCenter,
    onClick: () => editor.chain().focus().setTextAlign('center').run(),
    disable: false,
    isActive: editor.isActive({ textAlign: 'center' })
      ? 'is-active text-green-700 text-center'
      : '',
  },
  {
    id: 16,
    name: 'align right',
    icon: AlignRight,
    onClick: () => editor.chain().focus().setTextAlign('right').run(),
    disable: false,
    isActive: editor.isActive({textAlign: 'right'})
      ? 'is-active'
      : '',
  },
  {
    id: 17,
    name: 'align justify',
    icon: AlignJustify,
    onClick: () => editor.chain().focus().setTextAlign('justify').run(),
    disable: false,
    isActive: editor.isActive({ textAlign: 'justify' }) ? 'is-active' : '',
  },
  {
    id: 18,
    name: 'highlight',
    icon: Highlighter,
    onClick: () => editor.chain().focus().toggleHighlight().run(),
    disable: false,
    isActive: editor.isActive('highlight') ? 'is-active text-green-700' : '',
  },
  {
    id: 19,
    name: 'code block',
    icon: Code2,
    onClick: () => editor.chain().focus().toggleCodeBlock().run(),
    disable: false,
    isActive: editor.isActive('codeBlock') ? 'is-active text-green-700' : '',
  },
  {
    id: 20,
    name: 'blockquote',
    icon: TextQuote,
    onClick: () => editor.chain().focus().toggleBlockquote().run(),
    disable: false,
    isActive: editor.isActive('blockquote') ? 'is-active text-green-700' : '',
  },
  {
    id: 21,
    name: 'table',
    icon: TableIcon,
    onClick: () =>
      editor
        .chain()
        .focus()
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run(),
    disable: false,
    isActive: editor.isActive('table') ? 'is-active text-green-700' : '',
  },
  {
    id: 30,
    name: 'undo',
    icon: Undo2,
    onClick: () => editor.chain().focus().undo().run(),
    disable: !editor.can().undo(),
    isActive: editor.isActive('table') ? 'is-active text-green-700' : '',
  },
  {
    id: 31,
    name: 'redo',
    icon: Redo2,
    onClick: () => editor.chain().focus().redo().run(),
    disable: !editor.can().redo(),
    isActive: editor.isActive('table') ? 'is-active text-green-700' : '',
  },
]

const MenuBar = ({ editor } : { editor: Editor | null }) => {
  if (!editor) return null
  const menuIcons = MenuIcon({ editor })
  return (
    <div className="flex items-center gap-1 bg-black p-2 text-white w-full overflow-x-auto">
      {menuIcons.map((item) => (
        <div key={item.id} className="flex items-center h-full gap-1">
          <button
            key={item.id}
            onClick={item.onClick}
            disabled={item.disable}
            className={`${
              item.disable
                ? 'cursor-not-allowed p-1'
                : 'cursor-pointer hover:bg-gray-500 hover:rounded-lg p-1'
            } + ${item.isActive ? item.isActive : ''}`}
          >
            <item.icon/>
          </button>
        </div>
      ))}
    </div>
  )
}

const Tiptap = ({html, onChange}: TipTapProps) => {
  const lowlight = createLowlight(common);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: false,
        bulletList: {
          keepMarks: true,
        },
        orderedList: {
          keepMarks: true,
        }
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
      Underline,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Typography,
      Highlight,
      Table,
      TableHeader,
      TableRow,
      TableCell,
      TextAlign,
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
    <div className="border border-gray-400 rounded-md overflow-auto">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}

export default Tiptap
