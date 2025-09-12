import React, { useState } from 'react';
import FAQItem from './FAQItem';


const Accordion = ({ faqData }) => {
    const [openIndex, setOpenIndex] = useState(null);

    const handleToggle = (index) => {
        setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    return (
        <div>
            {faqData.map((item, index) => (
                <FAQItem
                    key={index}
                    index={index}
                    isOpen={index === openIndex}
                    onToggle={handleToggle}
                    question={item.question}
                    answer={item.answer}
                />
            ))}
        </div>
    );
};

export default Accordion;