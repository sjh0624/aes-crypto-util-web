import Image from 'next/image'
import styles from './page.module.scss'
import AesDecryptLiveEditor from "@/components/AesDecryptLiveEditor";
import {useRouter, useSearchParams} from "next/navigation";

export default function Home() {

    return (
        <main className={styles.main}>
            <AesDecryptLiveEditor className={styles.liveEditor}/>
        </main>
    )
}
