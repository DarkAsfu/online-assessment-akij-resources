import React, { useEffect, useRef } from 'react'
import { Bold, ChevronDown, Italic, List, RotateCcw, RotateCw } from 'lucide-react'

const toolbarIconClass = 'cursor-pointer text-[#212529]'

const RichTextEditor = ({
  value = '',
  onChange,
  placeholder = ' ',
  minHeight = 92,
  showToolbar = true,
  className = '',
  editorClassName = '',
}) => {
  const editorRef = useRef(null)

  useEffect(() => {
    if (!editorRef.current) return
    if (editorRef.current.innerHTML === value) return
    editorRef.current.innerHTML = value || ''
  }, [value])

  const emitChange = () => {
    if (!editorRef.current || !onChange) return
    onChange(editorRef.current.innerHTML)
  }

  const runCommand = (command) => {
    if (!editorRef.current) return
    editorRef.current.focus()
    document.execCommand(command, false)
    emitChange()
  }

  return (
    <div className={`w-full overflow-hidden rounded-lg border border-[#e5e7eb] bg-white ${className}`.trim()}>
      {showToolbar ? (
        <div className='flex items-center gap-2 bg-[#f9fafb] px-4 py-1.75'>
          <button type='button' className={toolbarIconClass} onClick={() => runCommand('undo')}>
            <RotateCcw size={20} />
          </button>
          <button type='button' className={toolbarIconClass} onClick={() => runCommand('redo')}>
            <RotateCw size={20} />
          </button>
          <button
            type='button'
            className='flex items-center gap-1 rounded px-1 text-[14px] text-[#212529]'
            onClick={() => runCommand('removeFormat')}
          >
            <span>Normal text</span>
            <ChevronDown size={16} />
          </button>
          <button
            type='button'
            className='flex items-center gap-1 rounded px-1 text-[#212529]'
            onClick={() => runCommand('insertUnorderedList')}
          >
            <List size={20} />
            <ChevronDown size={16} />
          </button>
          <button type='button' className={toolbarIconClass} onClick={() => runCommand('bold')}>
            <Bold size={20} />
          </button>
          <button type='button' className={toolbarIconClass} onClick={() => runCommand('italic')}>
            <Italic size={20} />
          </button>
        </div>
      ) : null}

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={emitChange}
        data-placeholder={placeholder}
        className={`w-full border-0 bg-white px-4 py-3 text-[14px] text-[#334155] focus:outline-none empty:before:text-[#94a3b8] empty:before:content-[attr(data-placeholder)] ${editorClassName}`.trim()}
        style={{ minHeight }}
      />
    </div>
  )
}

export default RichTextEditor