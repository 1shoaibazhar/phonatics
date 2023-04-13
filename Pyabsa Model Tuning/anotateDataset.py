from pyabsa import make_ABSA_dataset 
# refer to the comments in this function for detailed usage
# print(soup.prettify().encode('cp1252', errors='ignore'))
make_ABSA_dataset(dataset_name_or_path='integrated_datasets/phoneData10000.csv', checkpoint='english')