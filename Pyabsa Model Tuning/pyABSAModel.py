from pyabsa.functional import ATEPCModelList
from pyabsa.functional import Trainer, ATEPCTrainer
from pyabsa.functional import ABSADatasetList
from pyabsa.functional import ATEPCConfigManager
from autocuda import auto_cuda
import random
import torch

# atepc_config = ATEPCConfigManager.get_atepc_config_english()


# atepc_config.pretrained_bert = 'yangheng/deberta-v3-base-absa-v1.1'

# atepc_config.model = ATEPCModelList.FAST_LCF_ATEPC
config = ATEPCConfigManager.get_atepc_config_english()
config.model = ATEPCModelList.FAST_LCF_ATEPC
config.evaluate_begin = 0
config.max_seq_len = 128
config.pretrained_bert = 'yangheng/deberta-v3-base-absa'
config.l2reg = 1e-8
config.seed = random.randint(1, 100)
config.use_bert_spc = True
config.use_amp = False
config.cache_dataset = False
dataset_path = ABSADatasetList.Restaurant14
# dataset_path = '150.phoneData1000'

# torch.cuda.empty_cache()

aspect_extractor = ATEPCTrainer(config=config,
                                dataset=dataset_path,
                                from_checkpoint='',  # set checkpoint to train on the checkpoint.
                                checkpoint_save_mode=1,
                                auto_device=True
                                ).load_trained_model()


examples = ['But the staff was so nice to us .',
            'But the staff was so horrible to us .',
            'Not only was the food outstanding , but the little ` perks \' were great .',
            'It took half an hour to get our check , which was perfect since we could sit , have drinks and talk !',
            'It was pleasantly uncrowded , the service was delightful , the garden adorable , ',
            'the food -LRB- from appetizers to entrees -RRB- was delectable .',
            'How pretentious and inappropriate for MJ Grill to claim that it provides power lunch and dinners !'
            ]

inference_source = examples

atepc_result = aspect_extractor.extract_aspect(inference_source=inference_source,
                                               save_result=True,
                                               print_result=True,  # print the result
                                               pred_sentiment=True,  # Predict the sentiment of extracted aspect terms
                                               )

print(atepc_result)

