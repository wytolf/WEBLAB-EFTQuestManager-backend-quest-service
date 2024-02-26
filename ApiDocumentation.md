# Quest Service API Documentation

## POST /quests

Creates a new quest.

### Request Body

| Parameter | Type   | Description     |
|-----------|--------|-----------------|
| id        | number | Unique quest ID |
| title     | string | Questtitle      |
| map       | string | Questlocation   |
| trader    | string | Quest Trader    |
| link      | string | Link to wiki    |

#### Example Request

```json
{
  "id": 1,
  "title": "Delivery from the past",
  "map": "Customs",
  "trader": "Prapor",
  "link": "http://www.example.com"
}
```

## GET /quests

Retrieves a list with all Quests.

### Response

Returns a JSON array containing quest objects.

#### Example Response

```json
[
  {
      "id": 1,
      "title": "Delivery from the past",
      "map": "Customs",
      "trader": "Prapor",
      "link": "http://www.example.com"
  },
  {
      "id": 2,
      "title": "Delivery from the today",
      "map": "Woods",
      "trader": "Prapor",
      "link": "http://www.example.com/2"
    }
]
```

## GET /api/quests/:id

Retrieves a quest with the specified ID.

### Parameters

| Parameter | Type   | Description                 |
| --------- | ------ | --------------------------- |
| id        | string | The unique ID of the quest. |

#### Example

- GET /api/quests/<unique_quest_id_here>

### Response

- **200 OK**: Returns the quest object if found.

  ```json
  {
    "id": "unique_quest_id_here",
    "name": "example_quest_name",
    "type": "example_quest_type",
    "difficulty": "example_quest_difficulty",
    "participants": ["user1", "user2"]
  }

- **404 Not Found:** If the quest with the specified ID does not exist.
- **500 Internal Server Error:** If there's an issue with retrieving the quest.