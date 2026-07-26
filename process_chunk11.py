import json

def process_file():
    with open(r'c:\Users\iwaku\pro\shortcut2\chunk_11.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    for item in data:
        qid = item.get('id')
        if qid == 1206:
            item['explanation'] = "A. Windows + Lは画面のロック、Windows + Dはデスクトップの表示を行うため正解です。B. 逆であるため誤りです。C. 設定はWindows + I、エクスプローラーはWindows + Eであるため誤りです。D. コピー履歴（クリップボード履歴）はWindows + V、表示切替はWindows + Pなどを指すため誤りです。"
        elif qid == 1207:
            item['answer'] = "B. Ctrl + Shift + Escはタスクマネージャー、Alt + F4は現在のアプリ終了"
            item['explanation'] = "A. 逆であるため誤りです。B. Ctrl + Shift + Escはタスクマネージャーを開き、Alt + F4は現在アクティブなアプリを終了するため正解です。C. 新規フォルダーはCtrl + Shift + N、全画面はF11などのため誤りです。D. ロックはWindows + L、コピーはCtrl + Cなどのため誤りです。"
        elif qid == 1208:
            item['explanation'] = "A. F11はブラウザを全画面表示にし、Escは全画面表示やスライドショーを終了するため正解です。B. 印刷はCtrl + P、保存はCtrl + Sであるため誤りです。C. ファイル名変更はF2、タブ移動はCtrl + Tabなどのため誤りです。D. リンク挿入はCtrl + K、履歴削除はブラウザ等でCtrl + Shift + Deleteなどのため誤りです。"
        elif qid == 1209:
            item['answer'] = "B. Windows + P"
            item['explanation'] = "A. Windows + Dはデスクトップを表示するため誤りです。B. Windows + Pは「表示を切り替える（プロジェクターなどの設定）」メニューを開くため正解です。C. Windows + Vはクリップボード履歴を表示するため誤りです。D. Windows + Lは画面をロックするため誤りです。"
        elif qid == 1210:
            item['answer'] = "C. Shift + F5"
            item['explanation'] = "A. F5はスライドショーを最初から開始するため誤りです。B. Escはスライドショーを終了するため誤りです。C. Shift + F5は現在のスライドからスライドショーを開始するため正解です。D. Ctrl + Pは印刷ダイアログを開くため誤りです。"
        elif qid == 1211:
            item['answer'] = "D. F5"
            item['explanation'] = "A. Shift + F5は現在のスライドから開始するため誤りです。B. Escはスライドショーを終了するため誤りです。C. F11はブラウザ等の全画面表示でありPowerPointのスライドショー開始ではないため誤りです。D. F5はスライドショーを最初から（1枚目から）開始するため正解です。"
        elif qid == 1212:
            item['explanation'] = "A. スライドショー中にBキーを押すと画面が黒くなり、もう一度押すと元に戻るため正解です。B. Escはスライドショーを終了してしまうため誤りです。C. F5は最初から再生するため目的と異なります。D. Ctrl + Wはウィンドウやファイルを閉じるショートカットであるため誤りです。"
        elif qid == 1213:
            item['answer'] = "B. W"
            item['explanation'] = "A. Bキーは画面を黒くするため誤りです。B. Wキーはスライドショー中に画面を白くし、一時的に内容を隠すことができるため正解です。C. F11は無関係です。D. Ctrl + Pはスライドショー中ではペンツールに切り替えるため誤りです。"
        elif qid == 1214:
            item['answer'] = "C. Ctrl + P"
            item['explanation'] = "A. Ctrl + Bは太字（Bold）にするショートカット等であり誤りです。B. Ctrl + Kはリンク挿入などのため誤りです。C. スライドショー中にCtrl + Pを押すとマウスポインターがペン（Pen）に切り替わり、手書きができるため正解です。D. Ctrl + Uは下線（Underline）などを引くショートカットであり誤りです。"
        elif qid == 1215:
            item['answer'] = "D. Esc"
            item['explanation'] = "A. F5はページの更新などのため誤りです。B. F11はブラウザでの全画面表示の切り替えであり、動画の全画面解除には一般的にEscが使われます。C. Alt + F4はアプリ自体を終了してしまうため誤りです。D. Escキーは全画面表示を解除して通常表示に戻るため正解です。"
        elif qid == 1216:
            item['explanation'] = "A. Shift + 矢印キーはカーソルを移動させながら文字を1文字ずつ（細かく）選択するため正解です。B. Ctrl + 矢印キーは単語単位や段落単位でカーソルをジャンプさせるため誤りです。C. Alt + 矢印キーはブラウザの戻る・進むなどの操作になる場合があり誤りです。D. Windows + 矢印キーはウィンドウのスナップ（分割配置）を行うため誤りです。"
        elif qid == 1217:
            item['answer'] = "B. Ctrl + 矢印キー"
            item['explanation'] = "A. Shift + 矢印キーは文字を選択しながら移動するため誤りです。B. Ctrl + 矢印キーは単語ごと（あるいは文節ごと）にカーソルをジャンプして移動させるため正解です。C. Windows + 矢印キーはウィンドウの配置操作のため誤りです。D. Alt + 矢印キーはブラウザの履歴移動などに使われるため誤りです。"
        elif qid == 1218:
            item['answer'] = "C. 行頭はHome、文書先頭はCtrl + Home"
            item['explanation'] = "A. Endは行末、Ctrl + Endは文書末尾のため誤りです。B. Shift + Homeは行頭までを選択する操作のため誤りです。C. Homeは行の先頭へ、Ctrl + Homeは文書の先頭へ移動するため正解です。D. 組み合わせが逆であるため誤りです。"
        elif qid == 1219:
            item['answer'] = "D. 行末はEnd、文書末尾はCtrl + End"
            item['explanation'] = "A. Homeは行頭、Ctrl + Homeは文書先頭へ移動するため誤りです。B. Shift + Endは行末までを選択する操作のため誤りです。C. 組み合わせが逆であるため誤りです。D. Endは行の末尾へ、Ctrl + Endは文書の末尾へ移動するため正解です。"
        elif qid == 1220:
            item['explanation'] = "A. Shift + Homeはカーソル位置から行頭までを選択し、Shift + Endは行末までを選択するため正解です。B. Ctrl + HomeやCtrl + Endは文書の先頭・末尾への移動であり、選択はされないため誤りです。C. HomeやEndは単なる移動のため誤りです。D. Ctrl + ←/→は単語単位の移動であり誤りです。"
        elif qid == 1221:
            item['answer'] = "B. 太字Ctrl + B、斜体Ctrl + I、下線Ctrl + U"
            item['explanation'] = "A. 組み合わせがすべて誤っています。B. 太字はBoldのCtrl + B、斜体はItalicのCtrl + I、下線はUnderlineのCtrl + Uであるため正解です。C. 組み合わせが誤っています。D. Ctrl + Kはリンク挿入などのため誤りです。"
        elif qid == 1222:
            item['answer'] = "C. 左Ctrl + Backspace、右Ctrl + Delete"
            item['explanation'] = "A. 左右が逆であるため誤りです。B. 1文字ずつの削除であり、単語単位ではないため誤りです。C. Ctrl + Backspaceはカーソルの左側の単語を削除し、Ctrl + Deleteは右側の単語を削除するため正解です。D. Shift + Deleteはファイルの完全削除や切り取りなどに使われるため誤りです。"
        elif qid == 1223:
            item['answer'] = "B. リンク挿入Ctrl + K、ブックマークCtrl + D"
            item['explanation'] = "A. 左右が逆であるため誤りです。B. Ctrl + Kはリンクの挿入ダイアログを開き、Ctrl + Dはブラウザ等でブックマークを追加するため正解です。C, D. Ctrl + LやCtrl + Jはアドレスバーの選択やダウンロード履歴の表示などに使われるため誤りです。"
        elif qid == 1224:
            item['explanation'] = "A. デスクトップ表示はWindows + D、設定はWindows + I、ロックはWindows + Lであるため正解です。B, C, D. 別のショートカットキー（Windows + Eはエクスプローラー、Windows + Pは表示切り替え、Windows + Vはクリップボード履歴など）が混じっているため誤りです。"
        elif qid == 1225:
            item['answer'] = "B. エクスプローラーWindows + E、投影Windows + P、履歴Windows + V"
            item['explanation'] = "A. 組み合わせが誤っています。B. エクスプローラーはWindows + E、投影（表示）設定はWindows + P、クリップボード履歴はWindows + Vであるため正解です。C, D. それぞれ対応する機能が異なるため誤りです。"
        elif qid == 1226:
            item['answer'] = "C. 次Ctrl + Tab、前Ctrl + Shift + Tab、指定Ctrl + 数字"
            item['explanation'] = "A. Alt + Tabはアプリ（ウィンドウ）の切り替えのため誤りです。B. Ctrl + Tは新しいタブを開き、Ctrl + Wはタブを閉じる操作のため誤りです。C. Ctrl + Tabは次のタブへ、Ctrl + Shift + Tabは前のタブへ移動し、Ctrl + 数字キー（1〜9）は特定のタブ番号へ移動するため正解です。D. Ctrl + Rは更新、Ctrl + Hは履歴表示のため誤りです。"

    with open(r'c:\Users\iwaku\pro\shortcut2\chunk_11_done.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    process_file()
