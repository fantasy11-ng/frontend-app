'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Youtube from '@tiptap/extension-youtube';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { useCallback, useState } from 'react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Youtube as YoutubeIcon,
  Unlink,
  Palette,
  Type,
  Code2,
  X,
} from 'lucide-react';

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const COLORS = [
  '#000000', '#374151', '#6B7280', '#9CA3AF',
  '#DC2626', '#EA580C', '#D97706', '#CA8A04',
  '#16A34A', '#059669', '#0D9488', '#0891B2',
  '#2563EB', '#4F46E5', '#7C3AED', '#9333EA',
  '#C026D3', '#DB2777', '#E11D48',
];

const HIGHLIGHT_COLORS = [
  '#FEF08A', '#FDE047', '#FACC15',
  '#BBF7D0', '#86EFAC', '#4ADE80',
  '#BAE6FD', '#7DD3FC', '#38BDF8',
  '#DDD6FE', '#C4B5FD', '#A78BFA',
  '#FBCFE8', '#F9A8D4', '#F472B6',
];

export default function TipTapEditor({ content, onChange, placeholder = 'Start writing...' }: TipTapEditorProps) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-emerald-600 underline cursor-pointer hover:text-emerald-700',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg my-4',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Youtube.configure({
        width: 640,
        height: 360,
        HTMLAttributes: {
          class: 'rounded-lg my-4',
        },
      }),
      Subscript,
      Superscript,
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[300px] px-4 py-3',
      },
    },
  });

  const addLink = useCallback(() => {
    if (!editor || !linkUrl) return;
    
    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    }
    setShowLinkInput(false);
    setLinkUrl('');
  }, [editor, linkUrl]);

  const addImage = useCallback(() => {
    if (!editor || !imageUrl) return;
    editor.chain().focus().setImage({ src: imageUrl }).run();
    setShowImageInput(false);
    setImageUrl('');
  }, [editor, imageUrl]);

  const addYoutube = useCallback(() => {
    if (!editor || !youtubeUrl) return;
    editor.commands.setYoutubeVideo({ src: youtubeUrl });
    setShowYoutubeInput(false);
    setYoutubeUrl('');
  }, [editor, youtubeUrl]);

  const setTextColor = useCallback((color: string) => {
    if (!editor) return;
    editor.chain().focus().setColor(color).run();
    setShowColorPicker(false);
  }, [editor]);

  const setHighlight = useCallback((color: string) => {
    if (!editor) return;
    editor.chain().focus().toggleHighlight({ color }).run();
    setShowHighlightPicker(false);
  }, [editor]);

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    disabled = false,
    children,
    title,
  }: { 
    onClick: () => void; 
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title?: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-md transition-colors ${
        isActive 
          ? 'bg-emerald-100 text-emerald-700' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );

  const ToolbarDivider = () => (
    <div className="w-px h-6 bg-gray-200 mx-1" />
  );

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-gray-200 bg-gray-50">
        {/* Undo/Redo */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Text Formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          isActive={editor.isActive('subscript')}
          title="Subscript"
        >
          <SubscriptIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          isActive={editor.isActive('superscript')}
          title="Superscript"
        >
          <SuperscriptIcon className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Text Color */}
        <div className="relative">
          <ToolbarButton
            onClick={() => {
              setShowColorPicker(!showColorPicker);
              setShowHighlightPicker(false);
            }}
            title="Text Color"
          >
            <Palette className="w-4 h-4" />
          </ToolbarButton>
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 grid grid-cols-5 gap-1">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setTextColor(color)}
                  className="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                />
              ))}
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().unsetColor().run();
                  setShowColorPicker(false);
                }}
                className="w-6 h-6 rounded border border-gray-200 hover:bg-gray-100 flex items-center justify-center"
                title="Remove color"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Highlight */}
        <div className="relative">
          <ToolbarButton
            onClick={() => {
              setShowHighlightPicker(!showHighlightPicker);
              setShowColorPicker(false);
            }}
            isActive={editor.isActive('highlight')}
            title="Highlight"
          >
            <Highlighter className="w-4 h-4" />
          </ToolbarButton>
          {showHighlightPicker && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 grid grid-cols-5 gap-1">
              {HIGHLIGHT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setHighlight(color)}
                  className="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                />
              ))}
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().unsetHighlight().run();
                  setShowHighlightPicker(false);
                }}
                className="w-6 h-6 rounded border border-gray-200 hover:bg-gray-100 flex items-center justify-center"
                title="Remove highlight"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        <ToolbarDivider />

        {/* Headings */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          isActive={editor.isActive('paragraph')}
          title="Paragraph"
        >
          <Type className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Text Alignment */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          isActive={editor.isActive({ textAlign: 'justify' })}
          title="Justify"
        >
          <AlignJustify className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Block Elements */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
          title="Inline Code"
        >
          <Code className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
          title="Code Block"
        >
          <Code2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <Minus className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Link */}
        <div className="relative">
          <ToolbarButton
            onClick={() => {
              if (editor.isActive('link')) {
                editor.chain().focus().unsetLink().run();
              } else {
                setShowLinkInput(!showLinkInput);
                setShowImageInput(false);
                setShowYoutubeInput(false);
              }
            }}
            isActive={editor.isActive('link')}
            title={editor.isActive('link') ? 'Remove Link' : 'Add Link'}
          >
            {editor.isActive('link') ? <Unlink className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
          </ToolbarButton>
          {showLinkInput && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 flex gap-2">
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 w-56"
                onKeyDown={(e) => e.key === 'Enter' && addLink()}
              />
              <button
                type="button"
                onClick={addLink}
                className="px-3 py-1.5 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLinkInput(false);
                  setLinkUrl('');
                }}
                className="p-1.5 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Image */}
        <div className="relative">
          <ToolbarButton
            onClick={() => {
              setShowImageInput(!showImageInput);
              setShowLinkInput(false);
              setShowYoutubeInput(false);
            }}
            title="Add Image"
          >
            <ImageIcon className="w-4 h-4" />
          </ToolbarButton>
          {showImageInput && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Image URL..."
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 w-56"
                onKeyDown={(e) => e.key === 'Enter' && addImage()}
              />
              <button
                type="button"
                onClick={addImage}
                className="px-3 py-1.5 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowImageInput(false);
                  setImageUrl('');
                }}
                className="p-1.5 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* YouTube */}
        <div className="relative">
          <ToolbarButton
            onClick={() => {
              setShowYoutubeInput(!showYoutubeInput);
              setShowLinkInput(false);
              setShowImageInput(false);
            }}
            title="Embed YouTube"
          >
            <YoutubeIcon className="w-4 h-4" />
          </ToolbarButton>
          {showYoutubeInput && (
            <div className="absolute top-full right-0 mt-1 p-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 flex gap-2">
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="YouTube URL..."
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 w-56"
                onKeyDown={(e) => e.key === 'Enter' && addYoutube()}
              />
              <button
                type="button"
                onClick={addYoutube}
                className="px-3 py-1.5 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowYoutubeInput(false);
                  setYoutubeUrl('');
                }}
                className="p-1.5 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />

      {/* Word Count */}
      <div className="flex items-center justify-end px-4 py-2 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
        <span>{editor.storage.characterCount?.characters?.() ?? editor.getText().length} characters</span>
        <span className="mx-2">•</span>
        <span>{editor.storage.characterCount?.words?.() ?? editor.getText().split(/\s+/).filter(Boolean).length} words</span>
      </div>
    </div>
  );
}

