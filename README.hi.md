<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.md">English</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/mcp-tool-shop-org/brand/main/logos/aspire-si-gates/readme.png" alt="aspire-si-gates: the Stage 1 data gates package" width="400">
</p>

<p align="center">
  <a href="https://github.com/mcp-tool-shop-org/aspire-si-gates/actions/workflows/ci.yml"><img src="https://github.com/mcp-tool-shop-org/aspire-si-gates/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License"></a>
  <a href="https://pypi.org/project/aspire-si-gates/"><img src="https://img.shields.io/pypi/v/aspire-si-gates" alt="PyPI"></a>
  <a href="https://mcp-tool-shop-org.github.io/aspire-si-gates/"><img src="https://img.shields.io/badge/docs-landing_page-blue" alt="Landing page"></a>
</p>

**स्टेज 1 भूमिका-प्रशिक्षण सेट के लिए डेटा गेट:** एक मानक लाइब्रेरी पायथन पैकेज जो यह तय करता है कि क्या कोई पंक्ति, बैच या प्रशिक्षण वस्तुओं का एक स्थिर सेट प्रशिक्षण के लिए उपयुक्त है। प्रशिक्षक ([aspire-si](https://github.com/mcp-tool-shop-org/aspire-si)) और डेटासेट जनरेटर ([role-set](https://github.com/mcp-tool-shop-org/role-set)) दोनों इसे कॉल करते हैं, इसलिए जनरेटर जो स्वीकार करता है, वही प्रशिक्षक स्वीकार करेगा।

प्रत्येक गेट एक कारण बताता है या लौटाता है जिस पर आप कार्रवाई कर सकते हैं। कुछ भी चुपचाप तय नहीं किया जाता है।

## इंस्टॉल करें

```bash
pip install aspire-si-gates
```

पायथन 3.10 या उससे नया संस्करण। कोई निर्भरता नहीं।

## उपयोग करें

```python
from aspire_si_gates import DataError, load, validate

rows = load("batch3-t05.jsonl")      # one JSON object per line
try:
    validate(rows)                    # every row check, then every whole-set check
except DataError as err:
    print(err.code, err.message, err.hint)
```

एक जनरेटर जो अपनी अस्वीकृति को एक-एक करके अपने लेखक को वापस भेजना चाहता है, वह इसके बजाय वृद्धिशील जांच का उपयोग करता है:

```python
from aspire_si_gates import check_against, check_item

check_item(row)                       # raises DataError on the first refusal
problems = check_against(row, accepted_rows)   # [(code, message), ...] against rows already accepted
```

## गेट

| कॉल करें | यह क्या जांचता है |
|---|---|
| `validate(rows)` | प्रत्येक पंक्ति पर `check_item`, फिर पूरी फ़ाइल पर `check_batch`। पहली अस्वीकृति पर `DataError` उत्पन्न करता है। |
| `check_item(row)` | वे जांच जिन्हें किसी अन्य पंक्ति की आवश्यकता नहीं होती है। यह एक लागू आइटम (`split: apply` या एक `-AP-` आईडी) को अस्वीकार करता है: लागू आइटमों को कभी प्रशिक्षित नहीं किया जाता है। |
| `check_apply_item(row)` | एक लागू आइटम की जांच: `check_item` के समान सामग्री और आकार नियम, साथ ही लागू नियम (`split: apply` और एक `-AP-` आईडी, प्रकार C या D, एक मोड़, कोई जोड़ी नहीं, और पाठ का जुड़वां फ़ील्ड)। किसी भी ऐसी पंक्ति को अस्वीकार करता है जो लागू आइटम नहीं है। |
| `check_trace_leaks_label(row)` | एक प्रकार C पंक्ति को अस्वीकार करता है जिसका चेकर ट्रेस उसके स्वयं के लगाए गए दोष या दो-चरणीय कटौती के बाहर किसी भी दोष को इंगित करता है। `check_batch` में एकीकृत। |
| `check_against(row, accepted)` | `[(code, message)]` पहले से स्वीकृत पंक्तियों के विरुद्ध विशिष्टता नियमों (स्पैन, फ़्रेमिंग, सामग्री, पहेली आकार, उद्घाटन, वाक्यांश) के लिए। कोड `REASONS` में हैं। |
| `check_batch(rows)` | वे जांच जिन्हें पूर्ण सेट की आवश्यकता होती है: शेयर, फर्श, जोड़े, वाक्यांश और सूत्र सीमाएँ। |
| `batch_report(rows)`, `freeze_report(rows)` | उन जांचों के पीछे के आंकड़े, डिक्ट के रूप में। |
| `gates_identity()` | पैकेज संस्करण और इसके स्रोत का sha256, प्रत्येक उत्पन्न आइटम के साथ रिकॉर्ड करने के लिए। |

सत्यापन भूमिका का डेटा (पाठ, विशेषता नाम, भूमिका शब्द और संशोधन से पहले के पाठ) `constants.py` में है। एक अलग भूमिका उस मॉड्यूल को बदलती है, जांच को नहीं। सीलबंद-सेट रिसाव पैर यहां नहीं है; यह प्रशिक्षक के साथ रहता है।

## सुरक्षा और डेटा

- **पढ़ता है:** आपके द्वारा पास की गई पंक्तियाँ, और वह फ़ाइल जिसे आप `load` को देते हैं।
- **स्पर्श नहीं करता:** नेटवर्क, उस एक फ़ाइल से परे फ़ाइल सिस्टम, पर्यावरण चर, या उप-प्रक्रियाएँ। कोई टेलीमेट्री नहीं।
- **अनुमतियाँ:** उस फ़ाइल को पढ़ने से परे कोई अनुमति नहीं।

एक भेद्यता की निजी तौर पर रिपोर्ट करें; [SECURITY.md](SECURITY.md) देखें।

## स्थिति

संस्करण 1.7.6, पहली बार PyPI पर प्रकाशित। स्रोत, `6a603baa` पर aspire-si में मौजूद पैकेज के समान है, इसलिए `gates_identity()` पहले की तरह ही हैश की रिपोर्ट करता है। इस रिपॉजिटरी के अपने परीक्षणों का कवरेज 68% है, जिसमें न्यूनतम 68 (लक्ष्य 90) है; aspire-si के स्टेज 1 परीक्षणों द्वारा अधिक गेट मामलों का परीक्षण किया जाता है।

## गुणवत्ता गेट

कठोर गेट (सुरक्षा, त्रुटियां, दस्तावेज़, शिपिंग स्वच्छता) पास; [SHIP_GATE.md](SHIP_GATE.md) और [SCORECARD.md](SCORECARD.md) देखें।

## परीक्षण

```bash
python -m pytest -q
```

या रिलीज़ गेट द्वारा चलाए जाने वाले सभी परीक्षण चलाएँ: `bash scripts/verify.sh`।

## लाइसेंस

MIT, © mcp-tool-shop.

---

[MCP Tool Shop](https://mcp-tool-shop.github.io/) द्वारा निर्मित
