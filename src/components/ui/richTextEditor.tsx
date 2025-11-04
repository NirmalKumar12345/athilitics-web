'use client';

import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Strike from '@tiptap/extension-strike';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Strikethrough,
  Underline as UnderlineIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import classNames from 'classnames';

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function RichTextEditor({ value = '', onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          HTMLAttributes: {
            class: 'text-left text-2xl font-bold',
          },
        },
        paragraph: {
          HTMLAttributes: {
            class: 'text-left text-lg',
          },
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Strike,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: 'Eg; Rules, special notes, eligibility',
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  if (!editor) return null;

  return (
    <div className="rounded-md border border-[#282A28] bg-[#000] p-2 h-auto">
      <style jsx global>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #7f7f7f;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
          font-weight: 300;
          font-size: 16px;
        }
      `}</style>
      <div className="flex flex-wrap border-b border-[#282A28] pb-1">
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={classNames({
            'bg-white text-black': editor.isActive('bold'),
            'text-white': !editor.isActive('bold'),
          })}
        >
          <Bold size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={classNames({
            'bg-white text-black': editor.isActive('italic'),
            'text-white': !editor.isActive('italic'),
          })}
        >
          <Italic size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={classNames({
            'bg-white text-black': editor.isActive('underline'),
            'text-white': !editor.isActive('underline'),
          })}
        >
          <UnderlineIcon size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={classNames({
            'bg-white text-black': editor.isActive('strike'),
            'text-white': !editor.isActive('strike'),
          })}
        >
          <Strikethrough size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={classNames({
            'bg-white text-black': editor.isActive('bulletList'),
            'text-white': !editor.isActive('bulletList'),
          })}
        >
          <List size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={classNames({
            'bg-white text-black': editor.isActive('orderedList'),
            'text-white': !editor.isActive('orderedList'),
          })}
        >
          <ListOrdered size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={classNames({
            'bg-white text-black': editor.isActive({ textAlign: 'left' }),
            'text-white': !editor.isActive({ textAlign: 'left' }),
          })}
        >
          <AlignLeft size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={classNames({
            'bg-white text-black': editor.isActive({ textAlign: 'center' }),
            'text-white': !editor.isActive({ textAlign: 'center' }),
          })}
        >
          <AlignCenter size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={classNames({
            'bg-white text-black': editor.isActive({ textAlign: 'right' }),
            'text-white': !editor.isActive({ textAlign: 'right' }),
          })}
        >
          <AlignRight size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={classNames({
            'bg-white text-black': editor.isActive('heading', { level: 1 }),
            'text-white': !editor.isActive('heading', { level: 1 }),
          })}
        >
          <Heading1 size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={classNames({
            'bg-white text-black': editor.isActive('heading', { level: 2 }),
            'text-white': !editor.isActive('heading', { level: 2 }),
          })}
        >
          <Heading2 size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => {
            let url = '';
            if (typeof window !== 'undefined') {
              url = window.prompt('Enter URL') || '';
            }
            if (url) {
              editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
            }
          }}
          className={classNames({
            'bg-white text-black': editor.isActive('link'),
            'text-white': !editor.isActive('link'),
          })}
        >
          <LinkIcon size={16} />
        </Button>
      </div>

      <EditorContent
        editor={editor}
        className=" overflow-y-auto px-2 py-2 focus:outline-none text-lg text-white [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-4 [&_ul]:pl-6 [&_ol]:pl-6 [&_.ProseMirror]:min-h-[180px] [&_.ProseMirror]:outline-none [&_.ProseMirror]:cursor-text"
      />
    </div>
  );
}
