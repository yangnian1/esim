'use client'

/**
 * ControlledInput 组件使用示例
 * 
 * 这个组件解决了在受控输入框中选中中间文字输入时光标跳到最后的问题
 */

import { useState } from 'react'
import { ControlledInput } from './ControlledInput'

export function FormExample() {
  const [name, setName] = useState('')
  const [firstNamePinyin, setFirstNamePinyin] = useState('')
  const [lastNamePinyin, setLastNamePinyin] = useState('')
  const [idNumber, setIdNumber] = useState('')

  return (
    <form className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          姓名
        </label>
        <ControlledInput
          id="name"
          type="text"
          value={name}
          onChange={setName}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="请输入姓名"
        />
      </div>

      <div>
        <label htmlFor="firstNamePinyin" className="block text-sm font-medium text-gray-700 mb-2">
          姓拼音
        </label>
        <ControlledInput
          id="firstNamePinyin"
          type="text"
          value={firstNamePinyin}
          onChange={setFirstNamePinyin}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="请输入姓拼音"
        />
      </div>

      <div>
        <label htmlFor="lastNamePinyin" className="block text-sm font-medium text-gray-700 mb-2">
          名拼音
        </label>
        <ControlledInput
          id="lastNamePinyin"
          type="text"
          value={lastNamePinyin}
          onChange={setLastNamePinyin}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="请输入名拼音"
        />
      </div>

      <div>
        <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-2">
          证件号码
        </label>
        <ControlledInput
          id="idNumber"
          type="text"
          value={idNumber}
          onChange={setIdNumber}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="请输入证件号码"
        />
      </div>
    </form>
  )
}



