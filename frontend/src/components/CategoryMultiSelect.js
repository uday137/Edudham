import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

/**
 * CategoryMultiSelect
 * Props:
 *   selected   — string[]  currently selected categories
 *   onChange   — (string[]) => void
 *   options    — string[]  all available options
 *   placeholder — string
 *   testId     — string  (optional data-testid)
 */
const CategoryMultiSelect = ({
    selected = [],
    onChange,
    options = [],
    placeholder = 'Select categories',
    testId = 'category-multiselect',
}) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const toggle = (cat) => {
        if (selected.includes(cat)) {
            onChange(selected.filter((c) => c !== cat));
        } else {
            onChange([...selected, cat]);
        }
    };

    const remove = (cat, e) => {
        e.stopPropagation();
        onChange(selected.filter((c) => c !== cat));
    };

    return (
        <div ref={containerRef} style={{ position: 'relative' }} data-testid={testId}>
            {/* Trigger box */}
            <div
                onClick={() => setOpen((o) => !o)}
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '6px',
                    minHeight: '40px',
                    padding: '6px 10px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    background: '#fff',
                    cursor: 'pointer',
                    userSelect: 'none',
                    boxShadow: open ? '0 0 0 2px #6366f133' : 'none',
                    transition: 'box-shadow 0.15s ease',
                }}
            >
                {selected.length === 0 ? (
                    <span style={{ color: '#94a3b8', fontSize: '14px' }}>{placeholder}</span>
                ) : (
                    selected.map((cat) => (
                        <span
                            key={cat}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '12px',
                                fontWeight: 600,
                                background: '#dbeafe',
                                color: '#1d4ed8',
                                padding: '2px 8px 2px 10px',
                                borderRadius: '20px',
                                border: '1px solid #bfdbfe',
                            }}
                        >
                            {cat}
                            <span
                                onClick={(e) => remove(cat, e)}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '14px',
                                    height: '14px',
                                    borderRadius: '50%',
                                    background: '#93c5fd',
                                    cursor: 'pointer',
                                    lineHeight: 1,
                                }}
                            >
                                <X size={9} color="#1e40af" />
                            </span>
                        </span>
                    ))
                )}
                <ChevronDown
                    size={16}
                    color="#94a3b8"
                    style={{
                        marginLeft: 'auto',
                        flexShrink: 0,
                        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                    }}
                />
            </div>

            {/* Dropdown panel */}
            {open && (
                <div
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 4px)',
                        left: 0,
                        right: 0,
                        zIndex: 9999,
                        background: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                        padding: '8px',
                        maxHeight: '260px',
                        overflowY: 'auto',
                    }}
                >
                    {/* Select All / Clear All row */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '4px 6px 8px',
                            borderBottom: '1px solid #f1f5f9',
                            marginBottom: '4px',
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => onChange([...options])}
                            style={{
                                fontSize: '11px',
                                color: '#6366f1',
                                fontWeight: 600,
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: 0,
                            }}
                        >
                            Select all
                        </button>
                        <button
                            type="button"
                            onClick={() => onChange([])}
                            style={{
                                fontSize: '11px',
                                color: '#ef4444',
                                fontWeight: 600,
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: 0,
                            }}
                        >
                            Clear all
                        </button>
                    </div>

                    {/* Options */}
                    {options.map((cat) => {
                        const checked = selected.includes(cat);
                        return (
                            <label
                                key={cat}
                                onClick={() => toggle(cat)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '7px 10px',
                                    borderRadius: '7px',
                                    cursor: 'pointer',
                                    background: checked ? '#eff6ff' : 'transparent',
                                    transition: 'background 0.15s ease',
                                    marginBottom: '2px',
                                }}
                                onMouseEnter={(e) => {
                                    if (!checked) e.currentTarget.style.background = '#f8fafc';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = checked ? '#eff6ff' : 'transparent';
                                }}
                            >
                                {/* Custom checkbox */}
                                <span
                                    style={{
                                        width: '16px',
                                        height: '16px',
                                        flexShrink: 0,
                                        borderRadius: '4px',
                                        border: checked ? '2px solid #6366f1' : '2px solid #cbd5e1',
                                        background: checked ? '#6366f1' : '#fff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.15s ease',
                                    }}
                                >
                                    {checked && (
                                        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                                            <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </span>
                                <span style={{ fontSize: '13px', fontWeight: checked ? 600 : 400, color: checked ? '#1e40af' : '#334155' }}>
                                    {cat}
                                </span>
                            </label>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CategoryMultiSelect;
