import React, { useState } from 'react';
import './nonapp.css';
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true,
});

function AboutPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [tags, setTags] = useState('');
  const [backgroundInfo, setBackgroundInfo] = useState('');
  const [response, setResponse] = useState({});

  const callOpenAiApi = async (userPrompt) => {
    try {
      const completion = await openai.beta.chat.completions.parse({
        model: "gpt-4o-2024-08-06",
        messages: [
          {
            role: "system",
            content: "You are an AI that provides responses in a specific JSON format."
          },
          {
            role: "user",
            content: `${userPrompt}\nPlease provide the response in this format: {"key1": "value1", "key2": "value2"}.`
          },
        ],
        max_tokens: 100,
      });

      let jsonResponse = completion.choices[0].message.content;
      jsonResponse = jsonResponse.replace(/```json|```/g, '');
      const parsedResponse = JSON.parse(jsonResponse);
      console.log("UserPrompt", userPrompt);
      console.log('Parsed response:', parsedResponse);
      setResponse(parsedResponse);
    } catch (error) {
      console.error('Error fetching data:', error);
      setResponse('Failed to fetch or validate response from OpenAI');
    }
  };

  const fetchBackgroundInfo = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/search-reddit?query=${searchTerm}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setBackgroundInfo(data.results);
      return data.results;
    } catch (error) {
      console.error('Error fetching background info:', error);
      setBackgroundInfo('Failed to fetch background information');
      return null;
    }
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleTagsChange = (event) => {
    setTags(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    var fetchedBackgroundInfo = await fetchBackgroundInfo();
    fetchedBackgroundInfo = fetchedBackgroundInfo.substring(0, 3000);

    if (fetchedBackgroundInfo) {
      const userPrompt = `Help extract information about product reviews. You will get a chunk of product review text and categories of information to extract. Return a JSON output that associates brands with an array of their ranking, in order of the categories. 

                          You are given these categories: ${tags}. The rankings should start at 1 and there should be no ties. You are given this background information: ${fetchedBackgroundInfo}. Only return the JSON in the specified format.`;
      callOpenAiApi(userPrompt);
    }
  };

  const renderTable = () => {
    if (!response || !tags) return null;

    const tagArray = tags.split(',').map(tag => tag.trim());

    return (
      <table id="rankingsTable" border="1">
        <thead>
          <tr>
            <th>Product</th>
            {tagArray.map((tag, index) => (
              <th key={index}>{tag}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(response).map((product) => (
            <tr key={product}>
              <td>{product}</td>
              {Array.isArray(response[product])
                ? response[product].map((ranking, index) => (
                    <td key={index}>{ranking}</td>
                  ))
                : <td colSpan={tagArray.length}>No rankings available</td>
              }
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="App">
      <h1>Search</h1>
      <form onSubmit={handleFormSubmit} className="search-form">
        <input
          type="text"
          className="search-bar"
          placeholder="Enter search term..."
          value={searchTerm}
          onChange={handleSearchTermChange}
        />

        <input
          type="text"
          className="search-bar"
          placeholder="Enter tags (comma separated)..."
          value={tags}
          onChange={handleTagsChange}
        />

        <button type="submit" className="submit-button">Search</button>
      </form>
      {response && <p>Response from OpenAI:</p>}
      
      {/* Render the table */}
      {response && renderTable()}
    </div>
  );
}

export default AboutPage;
