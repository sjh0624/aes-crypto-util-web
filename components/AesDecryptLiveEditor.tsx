"use client";

import React, {useMemo, useState} from "react";
import {AesCryptoUtil} from "@/util/AesCryptoUtil";
import s from "./aesDecryptLiveEditor.module.scss";
import {useRouter, useSearchParams} from "next/navigation";

function getReplacedSearchParam(key: string, value: string | null) {
    const searchParams = new URLSearchParams(location.search);
    if (value === null) {
        searchParams.delete(key);
    } else {
        searchParams.set(key, value);
    }
    const search = searchParams.toString();
    return search ? `?${search}` : '';
}

function replaceSearchParam(key: string, value: string | null) {
    history.replaceState(null, '', getReplacedSearchParam(key, value));
}

export default function AesDecryptLiveEditor({className}: { className: string }) {

    const searchParams = useSearchParams();
    const defaultSecret = searchParams.get('secret') ?? '';
    const defaultPrettyJsonEnabled = searchParams.get('prettyJson') === 'true';

    // TextArea와 값이 연동되는 useState 작성
    const [input, setInput] = useState<string>('')
    const [secret, setSecret] = useState<string>(defaultSecret)

    const [prettyJsonEnabled, setPrettyJsonEnabled] = useState<boolean>(defaultPrettyJsonEnabled);

    const [message, setMessage] = useState<string>('');

    const handleSecretChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSecret(e.target.value);
        replaceSearchParam('secret', e.target.value);
    };

    const handlePrettyJsonEnabledChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPrettyJsonEnabled(e.target.checked);
        replaceSearchParam('prettyJson', e.target.checked ? 'true' : null)
    }

    const output = useMemo(() => {
        try {
            const value = (() => {
                const value = AesCryptoUtil.decrypt(input, secret);
                if (prettyJsonEnabled) {
                    return JSON.stringify(JSON.parse(value), null, 2);
                }
                return value;
            })();
            return {type: 'success', value} as const;
        } catch (e) {
            return {type: 'error', value: String(e)} as const;
        }
    }, [input, secret, prettyJsonEnabled]);

    return (
        <div className={s.root + ' ' + className}>
            {/*secret state와 연동되는 input 필요*/}
            <input
                className={s.secret}
                value={secret}
                onChange={handleSecretChange}
                placeholder="Input secret here"
            />
            {/*input state와 연동되는 input 필요*/}
            <textarea
                className={s.input}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Input text here"
            />
            <textarea
                className={s.output + " " + output.type}
                value={output.value}
                readOnly
                placeholder="Output text here"
            />
            <label className={s.prettyJsonEnabled}>
                <input
                    type="checkbox"
                    checked={prettyJsonEnabled}
                    onChange={handlePrettyJsonEnabledChange}
                />
                pretty json
            </label>
            <div>
                <button className={s.copy} onClick={() => {
                    // 클립보드에 값 복사 후 복사 완료 얼럿
                    navigator.clipboard.writeText(output.value)
                        .then(() => {
                            setMessage('클립보드에 복사되었습니다.');
                            setTimeout(() => setMessage(''), 3000);
                        });
                }}>copy
                </button>

                {/*5초 정도 나타나는 동적 메시지 표시*/}
                <div className={s.message}>{message}</div>

            </div>
        </div>
    )
}

