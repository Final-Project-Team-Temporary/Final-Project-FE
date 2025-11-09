"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { BookmarkPlus, Loader2, CheckCircle } from "lucide-react"
import { saveTerm } from "@/services/terms"
import { useToast } from "@/hooks/use-toast"

interface TermExplanationModalProps {
  isOpen: boolean
  onClose: () => void
  selectedTerm: string
  explanation: string
}

export default function TermExplanationModal({
  isOpen,
  onClose,
  selectedTerm,
  explanation,
}: TermExplanationModalProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    if (isSaving || isSaved) return

    setIsSaving(true)
    try {
      await saveTerm(selectedTerm, explanation)
      setIsSaved(true)
      toast({
        title: "용어 저장 완료",
        description: `"${selectedTerm}"이(가) 나의 용어집에 저장되었습니다.`,
      })

      // 2초 후 저장 완료 상태 초기화
      setTimeout(() => {
        setIsSaved(false)
      }, 2000)
    } catch (error) {
      console.error("Failed to save term:", error)
      toast({
        title: "저장 실패",
        description: "용어 저장에 실패했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleClose = () => {
    setIsSaved(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-900">용어 설명</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            AI가 생성한 용어 설명입니다. 나의 용어집에 저장할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 선택된 용어 */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">선택한 용어</label>
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
              <p className="text-lg font-bold text-blue-900">{selectedTerm}</p>
            </div>
          </div>

          {/* 용어 설명 */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">설명</label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
              <p className="text-sm text-gray-800 leading-relaxed">{explanation}</p>
            </div>
          </div>

          {/* AI 생성 표시 */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>AI가 생성한 설명입니다</span>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleClose} className="flex-1">
            닫기
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || isSaved}
            className="flex-1 bg-blue-900 hover:bg-blue-800"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                저장 중...
              </>
            ) : isSaved ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                저장 완료
              </>
            ) : (
              <>
                <BookmarkPlus className="w-4 h-4 mr-2" />
                나의 용어집에 저장
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
