import React, { useState, useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  Check, 
  AlertTriangle, 
  FileText, 
  CornerDownRight, 
  Wand2, 
  Download,
  BadgeCheck as VerifiedIcon, 
  Quote, 
  Link as LinkIcon,
  ListOrdered, 
  List, 
  Heading1, 
  Heading2, 
  Bold, 
  Italic, 
  Highlighter,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';
import { fakeVerify, VerifyStatus } from '../../lib/verify';
import { autoformatHtml } from '../../lib/autoformat';
import { exportToMarkdown, downloadMarkdown } from '../../lib/export/md';
import { downloadDocx } from '../../lib/export/docx';

interface EdenWriterProps {
  className?: string;
  onContentChange?: (content: string) => void;
  initialContent?: string;
}

type VerificationStatus = 'verified' | 'flagged' | 'unverified';

// Helper function to convert VerifyStatus object to simple string status
const getVerificationStatus = (verifyResult: VerifyStatus): VerificationStatus => {
  if (verifyResult.isValid) {
    return 'verified';
  } else if (verifyResult.message?.includes('citation') || verifyResult.message?.includes('source')) {
    return 'flagged';
  } else {
    return 'unverified';
  }
};

const VerifyPill: React.FC<{ status: VerificationStatus; confidence: number }> = ({ status, confidence }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'verified':
        return {
          icon: Check,
          color: 'text-green-600 bg-green-50 border-green-200',
          label: 'Verified'
        };
      case 'flagged':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
          label: 'Needs Citation'
        };
      case 'unverified':
        return {
          icon: Highlighter,
          color: 'text-gray-600 bg-gray-50 border-gray-200',
          label: 'Unverified'
        };
      default:
        return {
          icon: Highlighter,
          color: 'text-gray-600 bg-gray-50 border-gray-200',
          label: 'Unverified'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}>
      <Icon size={12} />
      <span>{config.label}</span>
      <span className="opacity-60">({Math.round(confidence * 100)}%)</span>
    </div>
  );
};

const ToolbarButton: React.FC<{
  onClick: () => void;
  isActive?: boolean;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
}> = ({ onClick, isActive, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${
      isActive ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
    }`}
    title={label}
    aria-label={label}
  >
    <Icon size={16} />
  </button>
);

export const EdenWriter: React.FC<EdenWriterProps> = ({ 
  className = '', 
  onContentChange,
  initialContent = ''
}) => {
  const [autoformat, setAutoformat] = useState(false);
  const [verifyMode, setVerifyMode] = useState<'strict' | 'assisted' | 'lenient'>('assisted');
  const [wordCount, setWordCount] = useState(0);
  const [verifyResult, setVerifyResult] = useState<{ status: VerificationStatus; confidence: number }>({
    status: 'unverified',
    confidence: 0
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your document...',
        showOnlyWhenEditable: true,
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText();
      
      if (autoformat) {
        const formatted = autoformatHtml(html);
        if (formatted !== html) {
          editor.commands.setContent(formatted);
        }
      }
      
      const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
      setWordCount(words);
      
      const result = fakeVerify(text);
      setVerifyResult({
        status: getVerificationStatus(result),
        confidence: result.isValid ? 0.9 : 0.3
      });
      
      onContentChange?.(html);
    },
  });

  const insertCitation = useCallback(() => {
    if (!editor) return;
    editor.commands.insertContent('[1]');
  }, [editor]);

  const insertQuote = useCallback(() => {
    if (!editor) return;
    editor.commands.insertContent('<blockquote>Quote from source</blockquote>');
  }, [editor]);

  const exportAsMarkdown = useCallback(() => {
    if (!editor) return;
    const content = editor.getHTML();
    const markdown = exportToMarkdown(content, 'Document');
    downloadMarkdown(markdown, 'document.md');
  }, [editor]);

  const exportAsDocx = useCallback(() => {
    if (!editor) return;
    const content = editor.getHTML();
    downloadDocx(content, 'document.docx');
  }, [editor]);

  const verifyAll = useCallback(() => {
    if (!editor) return;
    const text = editor.getText();
    const result = fakeVerify(text);
    setVerifyResult({
      status: getVerificationStatus(result),
      confidence: result.isValid ? 0.9 : 0.3
    });
  }, [editor]);

  if (!editor) {
    return (
      <div className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 ${className}`}>
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          Loading editor...
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200/60 dark:border-gray-700/60">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Writer</h2>
            <VerifyPill status={verifyResult.status} confidence={verifyResult.confidence} />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>{wordCount} words</span>
            <div className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            <button
              onClick={() => setAutoformat(!autoformat)}
              className={`px-2 py-1 rounded-md text-xs transition-colors ${
                autoformat 
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Autoformat
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              isActive={editor.isActive('heading', { level: 1 })}
              icon={Heading1}
              label="Heading 1"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor.isActive('heading', { level: 2 })}
              icon={Heading2}
              label="Heading 2"
            />
          </div>
          
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"></div>
          
          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              icon={Bold}
              label="Bold"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              icon={Italic}
              label="Italic"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive('underline')}
              icon={Type}
              label="Underline"
            />
          </div>
          
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"></div>
          
          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
              icon={List}
              label="Bullet List"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
              icon={ListOrdered}
              label="Numbered List"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive('blockquote')}
              icon={Quote}
              label="Quote"
            />
          </div>
          
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"></div>
          
          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={insertCitation}
              icon={FileText}
              label="Insert Citation"
            />
            <ToolbarButton
              onClick={insertQuote}
              icon={Quote}
              label="Insert Quote"
            />
            <ToolbarButton
              onClick={verifyAll}
              icon={VerifiedIcon}
              label="Verify All"
            />
          </div>
          
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"></div>
          
          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={exportAsMarkdown}
              icon={Download}
              label="Export Markdown"
            />
            <ToolbarButton
              onClick={exportAsDocx}
              icon={FileText}
              label="Export DOCX"
            />
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 p-6">
        <EditorContent 
          editor={editor} 
          className="prose prose-gray dark:prose-invert max-w-none focus:outline-none"
        />
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200/60 dark:border-gray-700/60">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <span>Verify Mode: {verifyMode}</span>
            <span>Autoformat: {autoformat ? 'On' : 'Off'}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setVerifyMode(verifyMode === 'strict' ? 'assisted' : verifyMode === 'assisted' ? 'lenient' : 'strict')}
              className="px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {verifyMode}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EdenWriter;
