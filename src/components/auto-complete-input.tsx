import {useState} from 'react';
import {Form, FormControl, ListGroup} from 'react-bootstrap';

interface AutoProps {
    suggestions: string[]
    onChooseSuggestion: (chooseSuggestion:string) => void;
}

const AutocompleteInput = (props: AutoProps) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

    const handleChange = (e: { target: { value: string }; }) => {
        const searchTerm = e.target.value;
        setSearchTerm(searchTerm);
        props.onChooseSuggestion(searchTerm);
        const filteredSuggestions: string[] = props.suggestions.filter((suggestion) =>
            suggestion.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredSuggestions(filteredSuggestions);
    };



    const handleSelectSuggestion = (suggestion: string) => {
        setSearchTerm(suggestion);
        setFilteredSuggestions([]);
    };

    return (
        <Form>
            <FormControl
                type="text"
                placeholder="Type to search..."
                value={searchTerm}
                onChange={handleChange}
            />
            {filteredSuggestions.length > 0 && (
                <ListGroup className="autocomplete-list">
                    {filteredSuggestions.map((suggestion, index) => (
                        <ListGroup.Item
                            key={index}
                            onClick={() => handleSelectSuggestion(suggestion)}
                            action
                        >
                            {suggestion}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </Form>
    );
};

export default AutocompleteInput;
