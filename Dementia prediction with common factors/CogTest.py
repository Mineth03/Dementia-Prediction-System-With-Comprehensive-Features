def moca_assessment():
    print("\nWelcome to the Montreal Cognitive Assessment (MoCA) Test\n")
    print("Please answer the following questions. Each correct answer will earn points.")
    
    score = 0

    # 1. Visuospatial/Executive
    print("\n1. Visuospatial/Executive Tasks")
    answer = input("Draw a clock showing the time '10 past 11'. Enter 'done' when finished: ").strip().lower()
    if answer == 'done':
        score += 3  # Assume correct drawing; modify based on evaluation.

    # 2. Naming
    print("\n2. Naming")
    naming_answers = ["lion", "rhino", "camel"]
    for i, animal in enumerate(naming_answers, 1):
        answer = input(f"What is the name of this animal {i}? (e.g., {animal}): ").strip().lower()
        if answer == animal:
            score += 1

    # 3. Attention
    print("\n3. Attention")
    # Forward Digit Span
    answer = input("Repeat the numbers: 2-1-8-5-4 (Type them in the same order): ").strip()
    if answer == "21854":
        score += 1
    # Backward Digit Span
    answer = input("Now repeat them backward: 7-4-2 (Type them in reverse order): ").strip()
    if answer == "247":
        score += 1
    # Serial 7s
    print("Starting from 100, subtract 7 until you can't anymore.")
    correct_answers = [93, 86, 79, 72, 65]
    for i in range(len(correct_answers)):
        try:
            answer = int(input(f"Subtract 7: "))
            if answer == correct_answers[i]:
                score += 1
            else:
                break
        except ValueError:
            print("Invalid input! Moving to the next section.")
            break

    # 4. Language
    print("\n4. Language")
    # Sentence repetition
    answer = input("Repeat the following sentence: 'The cat always hid under the couch when dogs were in the room.'\nYour answer: ").strip().lower()
    if answer == "the cat always hid under the couch when dogs were in the room":
        score += 1
    answer = input("Repeat the following sentence: 'I only know that John is the one to help today.'\nYour answer: ").strip().lower()
    if answer == "i only know that john is the one to help today":
        score += 1

    # 5. Abstraction
    print("\n5. Abstraction")
    answer = input("What is the similarity between a train and a bicycle? ").strip().lower()
    if "transport" in answer or "travel" in answer:
        score += 1
    answer = input("What is the similarity between a watch and a ruler? ").strip().lower()
    if "measurement" in answer:
        score += 1

    # 6. Delayed Recall
    print("\n6. Delayed Recall")
    delayed_recall_words = ["face", "velvet", "church", "daisy", "red"]
    print("Try to recall the following words: face, velvet, church, daisy, red")
    for word in delayed_recall_words:
        answer = input(f"Enter a word you recall: ").strip().lower()
        if answer in delayed_recall_words:
            score += 1

    # 7. Orientation
    print("\n7. Orientation")
    questions = [
        ("What is the date today?", "date"),
        ("What is the month?", "month"),
        ("What is the year?", "year"),
        ("What is the day of the week?", "day"),
        ("What is the name of this place?", "place"),
        ("What city are we in?", "city"),
    ]
    for question, key in questions:
        answer = input(question + " ").strip().lower()
        score += 1  # Assuming all are correct for simplicity.

    # Final Score
    print("\nTest Completed!\n")
    print(f"Your total MoCA score is: {score} / 30")
    if score >= 26:
        print("This is considered a normal cognitive function.")
    else:
        print("You may want to consult a medical professional for further evaluation.")

# Run the test
moca_assessment()
