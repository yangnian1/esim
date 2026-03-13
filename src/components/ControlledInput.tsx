'use client'

import { useRef, useEffect, type InputHTMLAttributes } from 'react'

interface ControlledInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: string
  onChange: (value: string) => void
}

/**
 * 受控输入框组件，修复选中中间文字输入时光标跳到最后的问题
 * 
 * 使用方法：
 * <ControlledInput
 *   value={name}
 *   onChange={setName}
 *   placeholder="请输入姓名"
 * />
 */
export function ControlledInput({ value, onChange, ...props }: ControlledInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const selectionRef = useRef<{ start: number; end: number } | null>(null)
  const previousValueRef = useRef<string>(value)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = inputRef.current
    if (input) {
      // 保存当前光标位置（在值改变之前）
      selectionRef.current = {
        start: input.selectionStart || 0,
        end: input.selectionEnd || 0,
      }
    }
    
    const newValue = e.target.value
    previousValueRef.current = value
    onChange(newValue)
  }

  // 恢复光标位置
  useEffect(() => {
    const input = inputRef.current
    if (!input || !selectionRef.current) {
      // 如果没有保存的光标位置，且值发生了变化，可能是外部更新
      // 这种情况下，光标应该保持在末尾
      if (value !== previousValueRef.current) {
        previousValueRef.current = value
      }
      return
    }

    const { start, end } = selectionRef.current
    const previousValue = previousValueRef.current
    const currentValue = value

    // 计算新光标位置
    let newStart = start
    let newEnd = end

    if (start !== end) {
      // 如果有选中文字（替换模式）
      // 例如：原值 "abc|def|ghi"，选中 "def"，输入 "x" 后变成 "abcxghi"
      // 删除的长度 = end - start = 3
      // 插入的长度 = currentValue.length - (previousValue.length - 3)
      const deletedLength = end - start
      const insertedLength = currentValue.length - (previousValue.length - deletedLength)
      newStart = start + insertedLength
      newEnd = newStart
    } else {
      // 如果没有选中文字（插入模式）
      // 例如：原值 "abc|def"，在 "c" 后输入 "x" 变成 "abcxdef"
      // 插入的长度 = currentValue.length - previousValue.length
      const insertedLength = currentValue.length - previousValue.length
      newStart = start + insertedLength
      newEnd = newStart
    }

    // 确保光标位置不超出范围
    newStart = Math.max(0, Math.min(newStart, currentValue.length))
    newEnd = Math.max(0, Math.min(newEnd, currentValue.length))

    // 使用 setTimeout 确保在 DOM 更新后执行
    const timer = setTimeout(() => {
      if (input) {
        input.setSelectionRange(newStart, newEnd)
        selectionRef.current = null
        previousValueRef.current = currentValue
      }
    }, 0)

    return () => clearTimeout(timer)
  }, [value])

  return (
    <input
      {...props}
      ref={inputRef}
      value={value}
      onChange={handleChange}
    />
  )
}

