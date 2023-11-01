import cv2
import tkinter as ttk
from tkinter import filedialog
import matplotlib.pyplot as plt
import numpy as np


##########################################################################################
def mask_detection(image, kernel):
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    return cv2.filter2D(src=gray_image, ddepth=-1, kernel=kernel)


def point_detection(image):
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    kernel = np.array([[-1, -1, -1],
                       [-1, 8, -1],
                       [-1, -1, -1]])
    pros_im = cv2.filter2D(src=gray_image, ddepth=-1, kernel=kernel)
    _, threshold = cv2.threshold(pros_im, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    return threshold


def horizontal_line_detection(image):
    return mask_detection(image, np.array([[-1, -1, -1],
                                           [2, 2, 2],
                                           [-1, -1, -1]]))


def vertical_line_detection(image):
    return mask_detection(image, np.array([[-1, 2, -1],
                                           [-1, 2, -1],
                                           [-1, 2, -1]]))


def _45_line_detection(image):
    return mask_detection(image, np.array([[-1, -1, 2],
                                           [-1, 2, -1],
                                           [2, -1, -1]]))


def _135_line_detection(image):
    return mask_detection(image, np.array([[2, -1, -1],
                                           [-1, 2, -1],
                                           [-1, -1, 2]]))


def edge_sobel_detection(image):
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    grad_x = cv2.Sobel(src=gray_image, ddepth=-1, dx=1, dy=0, ksize=3, borderType=cv2.BORDER_REFLECT)
    grad_y = cv2.Sobel(src=gray_image, ddepth=-1, dx=0, dy=1, ksize=3, borderType=cv2.BORDER_REFLECT)
    abs_grad_x = cv2.convertScaleAbs(grad_x)
    abs_grad_y = cv2.convertScaleAbs(grad_y)
    grad = cv2.addWeighted(abs_grad_x, 1, abs_grad_y, 1, 0)
    return grad


##########################################################################################
def otsu_thresholding(image):
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _, threshold = cv2.threshold(gray_image, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    return threshold


def histogram_thresholding(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    t = 126
    while True:
        upper_t = (gray > t).astype(np.uint8) * 255
        lower_t = (gray <= t).astype(np.uint8) * 255
        mean_brightness_upper = np.mean(upper_t)
        mean_brightness_lower = np.mean(lower_t)
        t_new = (mean_brightness_upper + mean_brightness_lower) / 2
        if abs(t_new - t) < 2:
            break
        t = t_new

    return (gray > t).astype(np.uint8) * 255


def adaptive_threshold(image):
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    return cv2.adaptiveThreshold(gray_image, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 11, 2)


##########################################################################################
# Read an image
def read_original_image():
    global original_image
    file_path = filedialog.askopenfilename(filetypes=[("Image files", "*.jpg;*.jpeg;*.png")])
    if file_path:
        image = cv2.imread(file_path)
        if image is not None:
            original_image = image.copy()
            plt.imshow(cv2.cvtColor(original_image, cv2.COLOR_BGR2RGB))
            plt.title("Opened Image")
            plt.axis("off")
            plt.show()


# Show several images
def show_images(processed_images, titles):
    fig, axes = plt.subplots(1, len(processed_images), figsize=(12, 5))
    for i, (processed_image, title) in enumerate(zip(processed_images, titles)):
        axes[i].set_title(title)
        axes[i].imshow(cv2.cvtColor(processed_image, cv2.COLOR_BGR2RGB))
        axes[i].axis('off')
    plt.show()


# Show several images
def show_many_images(processed_images, titles):
    fig, axes = plt.subplots(2, len(processed_images) // 2 + 1, figsize=(12, 6))
    for i, (processed_image, title) in enumerate(zip(processed_images, titles)):
        axes[i // 4][i % 4].set_title(title)
        axes[i // 4][i % 4].imshow(cv2.cvtColor(processed_image, cv2.COLOR_BGR2RGB))
        axes[i // 4][i % 4].axis('off')
    axes[len(processed_images) // 4][len(processed_images) % 4].axis('off')
    plt.show()


# Process an image in chosen way
def process_images(methods):
    global original_image
    if original_image is not None:
        processed_images = [original_image]
        titles = ["Original Image"]
        for method in methods:
            processed_image = method(original_image)
            processed_images.append(processed_image)
            titles.append(method.__name__.replace("_", " ").title())
        if len(processed_images) > 4:
            show_many_images(processed_images, titles)
        else:
            show_images(processed_images, titles)


original_image = None

# App window
root = ttk.Tk()
root.title("Lab2: Image Processing")
frame = ttk.Frame(root)
frame.grid()
ttk.Label(frame, text="Choose option: ").grid(column=0, row=0)
ttk.Button(frame, text="Choose Image", command=read_original_image).grid(column=0, row=1)
ttk.Button(frame, text="Segmentation",
           command=lambda: process_images([point_detection, horizontal_line_detection,
                                           vertical_line_detection, _45_line_detection, _135_line_detection,
                                           edge_sobel_detection])).grid(column=1, row=1)
ttk.Button(frame, text="Thresholding",
           command=lambda: process_images([otsu_thresholding, histogram_thresholding, adaptive_threshold])).grid(
    column=2, row=1)
root.mainloop()
