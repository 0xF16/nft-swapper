import { Collapse, Typography } from "antd";
import React from "react";
import faq from "../faq";

const { Panel } = Collapse;
const { Title } = Typography;


export default function FAQ() {
    const faqAnswers = (answerArr) => {
        return answerArr.map((answer) => {
            return <p>{answer}</p>
        })
    }
    const faqAccordion = faq.map((faqItem, index) => {
        return <Panel header={faqItem.question} key={index}>{faqAnswers(faqItem.answer)}</Panel>
    })
    return (
        <div style={{ margin: "auto", width: "70vw"}}>
            <Title style={{marginTop: 20}} level={3}>Frequently asked questions</Title>
            <Collapse style={{textAlign:'left' }}>
                {faqAccordion}
            </Collapse>
        </div>
    );
}
