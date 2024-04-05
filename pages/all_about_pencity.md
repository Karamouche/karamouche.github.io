# All about PenCity

For our last year of engineering school, our master thesis project focused on a computer vision field called _Real-time object detection_. Following this field, our project explores the realm of augmented reality, aiming to transform static drawings on paper into interactive and dynamic experiences. By leveraging innovative technologies such as deep learning and real-time object detection with YOLO, we choose to build our model using Google Creative Lab's QuickDraw dataset to train a robust drawings detection model.

![mockup.jpg](all_about_pencity/mockup.jpg)

The final goal is to create an augmented reality system that detects drawings in real-time and enhances the environment with corresponding 3D models. This initiative seeks to turn a simple sketch into a lively and interactive cityscape when viewed through a smartphone, blending artificial intelligence, object detection, and augmented reality.

This blog post will detail our approach to building such an AI, including the techniques we have chosen to integrate it with Unity, ultimately creating an augmented reality app for mobile.

## The dataset

As we where looking for a project idea in the field of augmented reality, we found the dataset _Quickdraw_ released by Google in 2018. This dataset is a collection of 50 million drawings tagged with one of the 345 different categories. It has been built with the data gathered on [quickdraw.withgoogle.com](https://quickdraw.withgoogle.com/), where the user had to draw a thing in less than 20 seconds.

![Untitled](all_about_pencity/Untitled.png)

Finding this dataset, we got the idea of the project, with the augmented reality application describe above. And because our project was to build a city, we needed to filter drawings to keep only relevent categories for our use case (eg., house, bridge, hospital, …). We ended up with keeping 17 categories related to this use case.

![Untitled](all_about_pencity/Untitled%201.png)

## Which AI should we use ?

The proper use case of our project is to create an AR experience using your smartphone. We needed then a fast and robust AI system, than can work in real time on a smartphone device, which is a huge constraint because of the power that AI ask to be used.
Following this problem, we choose to use the model named YOLO (You Only Look Once), which is known to be fast and light to execute, ensuring in real-time image processing. We focus on testing YOLOv8n, which was the version with the higher performances, and a fast inference time.

Now that we have the model, let the training step begin. For now, the model is not working with our data, because public trained versions of YOLO are usually made for “real pictures”, using a training dataset named COCO, which is too far from our drawings. That’s why we needed to start with an “empty model”, with randomly initialized weights.

## Build our training data

YOLO is an object detection model, which means that its purpose is to locate and identify objects on a selected pictures. As said earlier, we want it to identify drawings on a picture, and label those drawings with the good label.

![Illustration of how the AI should work](all_about_pencity/Untitled%202.png)

To do that, we need training data that corresponds to real use drawings. Our strategy was then to build a dataset, creating canvas with multiple drawings past on it.

Along that pictures, we need to define mathematics values so the model will understand where are located the drawing on the canva, and a drawing of what it is.

YOLO works with its own format, defined as a vector for each object on the training image.

$$
[C_n, B_x, B_y, B_w, B_h]
$$

Where $C_n$ is the class ID associated with the object, and $B_x, B_x, B_w, B_h$ are respectivly the coordinates x and y of the object, and its width and height. All of thoses vectors are written in a text file, one by line, where the file has the same name as the image file. Following that process, the YOLO training script will be capable of reading our data, and learn how to detect drawings on a paper sheet.

![Example of a training image.](all_about_pencity/Untitled%203.png)

## Create the app with Unity

Creating an app that brings drawings to life using augmented reality is like turning a piece of paper into a magical window. Imagine sketching a simple house or tree, and then through your phone's screen, you see it stand up in 3D, right on your desk! This is what our project aims to achieve, making the magic of augmented reality accessible to everyone, with just a smartphone and a piece of paper.

To make this happen, we're using a powerful tool called Unity, a game-developping platform used for 2D/3D and in our case, AR. With Unity, we used what we call AR Foundation,the Unity’s framework dedicated to AR builds.

![Untitled](all_about_pencity/Untitled%204.png)

## Challenges encountered during the build

As we were building our AR app, our project confronted substantial challenges, chiefly the meticulous placement of 3D models generated by AR Foundation, necessitating an exact alignment with corresponding sketches on paper, which demanded precise synchronization between object detection data and AR Foundation's placement mechanisms.

Additionally, ensuring that these 3D models remain anchored to the paper despite user interaction (lifting, turning, or flipping) required an optimized management of model placement and orientation relative to the paper.

Moreover, enhancing AR Foundation's plane recognition capabilities to consistently identify the paper as a valid surface for overlaying 3D models was crucial. Instead of using Unity’s built-in Plane detector ( AR Plane Manager) , we wanted our own touch , so we created a script to detect and adapt a surface layer to the paper, ensuring a good 3D model placement.

![Untitled](all_about_pencity/Untitled%205.png)

## Integrating Yolo with Unity

Integrating the YOLO model into Unity was initially the most challenging aspect of our project, but we're thrilled to announce that it's now successfully completed! We began by transforming the model into an ONNX file, a universal format compatible with Unity's Barracuda inference engine, enabling real-time object detection within the Unity environment.

This integration has revolutionized our project, allowing for dynamic processing of camera feeds directly within Unity. With YOLO now seamlessly integrated through Barracuda, it accurately detects drawings and instantiates 3D models in precise alignment with detected objects on paper, seamlessly merging deep learning algorithms with augmented reality.

While the integration process is complete, we're continuously refining our system to enhance user interaction. Our next steps involve fine-tuning the spawning mechanism for 3D models once detected by our algorithm. Additionally, we're excited to implement interactive elements such as object movement and animations, further enriching the user experience with dynamic augmented reality scenarios.

## Why you need to download our app ?

This isn't just an app; it's a doorway to blending your imagination with reality. It's a chance to see your art leap off the page and interact with it in a way that's never been possible before. Whether you're a parent looking for a fun activity with your kids, a teacher seeking a creative educational tool, or just someone who loves to draw and daydream, our app promises to bring a little extra magic into your life !
