import cv2
import mediapipe as mp

# Initialize MediaPipe hands
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(min_detection_confidence=0.7, min_tracking_confidence=0.5)
mp_draw = mp.solutions.drawing_utils

# Function to count the number of fingers
def count_fingers(image, landmarks):
    # List to hold the tip of each finger
    tip_ids = [4, 8, 12, 16, 20]
    
    fingers = []
    
    # Thumb
    if landmarks[tip_ids[0]].x < landmarks[tip_ids[0] - 1].x:
        fingers.append(1)
    else:
        fingers.append(0)
    
    # Other four fingers
    for id in range(1, 5):
        if landmarks[tip_ids[id]].y < landmarks[tip_ids[id] - 2].y:
            fingers.append(1)
        else:
            fingers.append(0)
    
    return fingers.count(1)

# Start capturing video
cap = cv2.VideoCapture(0)

while cap.isOpened():
    success, image = cap.read()
    
    if not success:
        print("Ignoring empty camera frame.")
        continue
    
    # Convert the image to RGB
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = hands.process(image)
    
    # Draw the hand annotations on the image
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
    
    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            mp_draw.draw_landmarks(image, hand_landmarks, mp_hands.HAND_CONNECTIONS)
            fingers_count = count_fingers(image, hand_landmarks.landmark)
            cv2.putText(image, f'Fingers: {fingers_count}', (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2, cv2.LINE_AA)
    
    # Display the resulting frame
    cv2.imshow('Hand Tracking', image)
    
    if cv2.waitKey(5) & 0xFF == 27:
        break

cap.release()
cv2.destroyAllWindows()
