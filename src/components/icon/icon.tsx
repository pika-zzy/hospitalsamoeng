import { icons } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useState } from "react"
import { ICON_COLORS } from "./colors"

const ALL_ICONS: {
    name: string
    icon: LucideIcon
}[] = Object.entries(icons).map(([name, icon]) => ({
    name,
    icon,
}))



type IconPickerProps = {
    value?: string
    color?: string
    onSelect?: (iconName: string) => void
    onColorSelect?: (color: string) => void
}


export default function IconPicker({
    value,
    onSelect,
    onColorSelect,
    color
}: IconPickerProps) {
    const [selectedColor, setSelectedColor] = useState(color || ICON_COLORS[0].label)
    const [iconSearch, setIconSearch] = useState("");
    const filteredIcons = ALL_ICONS.filter((icon) =>
        icon.name.toLowerCase().includes(iconSearch?.toLowerCase() || "")
    )
    const selectedColorConfig = ICON_COLORS.find(
        c => c.label === selectedColor
    )


    return (
        <>
            <div className="w-full ">
                <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                    <div className="p-3">
                        <div className="flex items-center gap-2 flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 h-9">
                            <input
                                type="text"
                                value={iconSearch}
                                onChange={e => setIconSearch(e.target.value)}
                                placeholder="ค้นหาไอคอน เช่น chart, file, user..."
                                className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 outline-none"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-6 gap-1 p-3 max-h-70 overflow-y-auto">
                        {filteredIcons.map(({ name, icon: Icon }) => (
                            <button
                            key={name}
                            type="button"
                            onClick={() => onSelect?.(name)}
                            className={`group flex flex-col items-center justify-center gap-1 h-13 rounded-lg border transition-all duration-100 hover:bg-gray-50 ${
                                value === name ? "border-blue-500 bg-blue-50" : ""
                            }`}
                            >
                            <Icon size={18} color={selectedColorConfig?.borderHex} />
                            </button>
                        ))}
                    </div>
                    
                    <div className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-100">
                        <span className="text-xs text-gray-400 mr-1">Color</span>

                        {ICON_COLORS.map((color) => (
                            <button
                            key={color.label}
                            type="button"
                            title={color.label}
                            aria-label={color.label}
                            onClick={() => {
                                setSelectedColor(color.label)
                                onColorSelect?.(color.label)
                            }}
                            className={`w-5 h-5 rounded-full cursor-pointer transition-transform duration-100 hover:scale-110 focus:outline-none
                                ${color.bgClass}
                                ${
                                    selectedColor === color.label
                                        ? `ring-2 ring-white ${color.borderClass}`
                                        : ""
                                }
                            `}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
        
    )
}

