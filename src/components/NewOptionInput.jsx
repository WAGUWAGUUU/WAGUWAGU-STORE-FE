import React from 'react';
import './NewOptionInput.css';

const NewOptionInput = ({ newOptions, handleNewOptionChange, handleAddNewOption, handleRemoveOption, loading }) => (
    <div>
        {newOptions.map((option, index) => (
            <div key={index} className='option-input-row'>
                <div className='option-input-container'>
                    <input
                        className='store-input option-input'
                        placeholder='옵션 제목'
                        value={option.optionTitle}
                        onChange={e => handleNewOptionChange(index, 'optionTitle', e.target.value)}
                    />
                    <input
                        className='store-input option-input'
                        placeholder='옵션 금액'
                        value={option.optionPrice}
                        onChange={e => handleNewOptionChange(index, 'optionPrice', e.target.value)}
                    />
                    {newOptions.length > 1 && (
                        <button className='menu-remove-button' onClick={() => handleRemoveOption(index)}>-</button>
                    )}
                </div>
            </div>
        ))}
        <button className='menu-add-button' onClick={handleAddNewOption} disabled={loading}>+</button>
    </div>
);

export default NewOptionInput;
